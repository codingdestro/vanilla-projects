const DB = 'habit-tracker-db';
const DBV = 1;
const SH = 'habits';
const SC = 'checkins';

const S = {
  habits: [],
  checkins: new Set(),
  view: new Date(),
  sel: fmt(new Date()),
  today: fmt(new Date()),
};

const $ = (sel) => document.querySelector(sel);

let db;

function fmt(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function dateOf(k) { const [y,m,d] = k.split('-').map(Number); return new Date(y,m-1,d); }
function esc(s) { return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c])); }

/* ── DB ── */

function openDB() {
  return new Promise((ok, err) => {
    const r = indexedDB.open(DB, DBV);
    r.addEventListener('upgradeneeded', () => {
      const d = r.result;
      if (!d.objectStoreNames.contains(SH)) d.createObjectStore(SH, { keyPath: 'id', autoIncrement: true });
      if (!d.objectStoreNames.contains(SC)) { const s = d.createObjectStore(SC, { keyPath: 'key' }); s.createIndex('date','date',{unique:false}); }
    });
    r.addEventListener('success', () => ok(r.result));
    r.addEventListener('error', () => err(r.error));
  });
}

function tx(store, mode='readonly') { return db.transaction(store,mode).objectStore(store); }
function all(store) { return new Promise((ok,err) => { const r = tx(store).getAll(); r.addEventListener('success',()=>ok(r.result)); r.addEventListener('error',()=>err(r.error)); }); }
function put(store, rec) { return new Promise((ok,err) => { const r = tx(store,'readwrite').put(rec); r.addEventListener('success',()=>ok(r.result)); r.addEventListener('error',()=>err(r.error)); }); }
function add(store, rec) { return new Promise((ok,err) => { const r = tx(store,'readwrite').add(rec); r.addEventListener('success',()=>ok(r.result)); r.addEventListener('error',()=>err(r.error)); }); }
function del(store, key) { return new Promise((ok,err) => { const r = tx(store,'readwrite').delete(key); r.addEventListener('success',ok); r.addEventListener('error',()=>err(r.error)); }); }

/* ── Helpers ── */

function chk(id, date) { return S.checkins.has(`${id}:${date||S.sel}`); }
function done(d) { return S.habits.filter(h => chk(h.id, d)).length; }

/* ── Render ── */

function habits() {
  $('#panel-date').textContent = dateOf(S.sel).toLocaleDateString(void 0, {weekday:'long',month:'long',day:'numeric'});
  const el = $('#habit-list');
  el.innerHTML = '';
  $('#empty-msg').hidden = S.habits.length > 0;
  el.hidden = S.habits.length === 0;
  S.habits.forEach(h => {
    const c = chk(h.id);
    const row = document.createElement('div');
    row.className = `habit-row${c?' completed':''}`;
    row.innerHTML = `<button class="chk-btn" data-tog="${h.id}" aria-label="Toggle ${esc(h.name)}" aria-pressed="${c}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></button><div class="habit-info"><p class="habit-name">${esc(h.name)}</p><p class="habit-note">${esc(h.note||'')}</p></div><button class="del-btn" data-del="${h.id}" aria-label="Delete ${esc(h.name)}">×</button>`;
    el.append(row);
  });
}

function stats() {
  const td = done(S.today);
  const allDays = new Set();
  S.checkins.forEach(k => { const [,d] = k.split(':'); if (done(d)===S.habits.length && S.habits.length) allDays.add(d); });
  let st = 0; const c = dateOf(S.today);
  while (allDays.has(fmt(c))) { st++; c.setDate(c.getDate()-1); }
  const ws = new Date(dateOf(S.today)); ws.setDate(ws.getDate()-ws.getDay());
  let wd = 0; for (let i=0;i<7;i++) { wd += done(fmt(ws)); ws.setDate(ws.getDate()+1); }
  const wt = S.habits.length * 7;
  $('#stat-streak').textContent = st;
  $('#stat-today').innerHTML = `${td}/<span id="stat-today-total">${S.habits.length}</span>`;
  $('#stat-week').textContent = `${wt?Math.round(wd/wt*100):0}%`;
  $('#stat-total').textContent = S.checkins.size;
  $('#storage-badge').textContent = 'local';
}

function heatmap() {
  const grid = $('#heatmap'); grid.innerHTML = '';
  const today = new Date(); today.setHours(0,0,0,0);
  const end = new Date(today); end.setDate(end.getDate() - today.getDay() + 6);
  const start = new Date(end); start.setDate(start.getDate() - 363);
  const weeks = [];
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 7)) {
    const col = [];
    const weekStart = new Date(cursor);
    for (let d = 0; d < 7; d++) {
      const dk = fmt(weekStart);
      const v = done(dk);
      let lvl = 0;
      if (v > 0) { const r = S.habits.length ? v / S.habits.length : 0; if (r >= 1) lvl = 4; else if (r >= .75) lvl = 3; else if (r >= .5) lvl = 2; else lvl = 1; }
      col.push({ dk, lvl, date: new Date(weekStart), today: dk === S.today });
      weekStart.setDate(weekStart.getDate() + 1);
    }
    weeks.push(col);
  }
  weeks.forEach(col => {
    const wrap = document.createElement('div'); wrap.className = 'heatmap-col';
    col.forEach(cell => {
      const cellEl = document.createElement('span');
      cellEl.className = `hm-cell hm-cell--${cell.lvl}`;
      if (cell.today) cellEl.style.outline = '1px solid var(--black)';
      cellEl.title = `${cell.date.toLocaleDateString(void 0,{month:'short',day:'numeric'})}: ${cell.lvl===4?'All':cell.lvl?'Some':'None'} done`;
      cellEl.setAttribute('role','img');
      cellEl.setAttribute('aria-label', cellEl.title);
      wrap.append(cellEl);
    });
    grid.append(wrap);
  });
}

function calendar() {
  $('#month-name').textContent = S.view.toLocaleDateString(void 0, {month:'long',year:'numeric'});
  const g = $('#cal-grid'); g.innerHTML = '';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(a => { const h = document.createElement('span'); h.className='cal-day-hdr'; h.setAttribute('role','columnheader'); h.textContent=a; g.append(h); });
  const y = S.view.getFullYear(), m = S.view.getMonth();
  const fd = new Date(y,m,1).getDay(), dim = new Date(y,m+1,0).getDate();
  for (let i=0;i<fd;i++) { const e = document.createElement('span'); e.className='cal-day empty'; e.setAttribute('role','gridcell'); g.append(e); }
  for (let d=1;d<=dim;d++) {
    const dk = fmt(new Date(y,m,d)), com = done(dk);
    const btn = document.createElement('button'); btn.type='button'; btn.className='cal-day';
    if (dk===S.today) btn.classList.add('today');
    if (dk===S.sel) btn.classList.add('selected');
    if (com===S.habits.length && S.habits.length) btn.classList.add('done');
    else if (com>0) btn.classList.add('some');
    btn.dataset.date = dk; btn.setAttribute('role','gridcell'); btn.textContent = d;
    btn.setAttribute('aria-label',`${new Date(y,m,d).toLocaleDateString(void 0,{month:'long',day:'numeric'})}, ${com} done`);
    g.append(btn);
  }
}

function paint() { habits(); stats(); heatmap(); calendar(); }

/* ── Actions ── */

async function tog(id) {
  const key = `${id}:${S.sel}`;
  if (S.checkins.has(key)) { S.checkins.delete(key); await del(SC, key); }
  else { S.checkins.add(key); await put(SC, {key, habitId:id, date:S.sel}); }
  paint();
}

async function create(e) {
  e.preventDefault();
  const name = $('#input-name').value.trim();
  if (!name) { $('#form-err').textContent='Name is required.'; return; }
  try {
    const rec = { name, note: $('#input-detail').value.trim(), at: Date.now() };
    const id = await add(SH, rec);
    S.habits.push({...rec, id});
    $('#form-habit').reset(); $('#form-err').textContent=''; $('#dialog-habit').close();
    paint(); toast('Habit added');
  } catch { $('#form-err').textContent='Save failed. Try again.'; $('#storage-badge').textContent='error'; }
}

async function remove(id) {
  const h = S.habits.find(x=>x.id===id);
  if (!h||!confirm(`Delete "${h.name}"?`)) return;
  await del(SH, id);
  const keys = [...S.checkins].filter(k=>k.startsWith(`${id}:`));
  await Promise.all(keys.map(k=>del(SC,k)));
  keys.forEach(k=>S.checkins.delete(k));
  S.habits = S.habits.filter(x=>x.id!==id);
  paint(); toast('Habit deleted');
}

function navMonth(d) {
  S.view = new Date(S.view.getFullYear(), S.view.getMonth()+d, 1);
  calendar();
}

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove('on'), 2000);
}

/* ── Bind ── */

function bind() {
  $('#btn-add').addEventListener('click', ()=>{ $('#form-err').textContent=''; $('#dialog-habit').showModal(); $('#input-name').focus(); });
  document.querySelectorAll('[data-add-btn]').forEach(b=>b.addEventListener('click', ()=>$('#dialog-habit').showModal()));
  $('#btn-close-dialog').addEventListener('click', ()=>$('#dialog-habit').close());
  $('#btn-cancel-dialog').addEventListener('click', ()=>$('#dialog-habit').close());
  $('#form-habit').addEventListener('submit', create);
  $('#habit-list').addEventListener('click', async e => {
    const t = e.target.closest('[data-tog]'); const d = e.target.closest('[data-del]');
    if (t) await tog(+t.dataset.tog);
    if (d) await remove(+d.dataset.del);
  });
  $('#cal-grid').addEventListener('click', e => {
    const b = e.target.closest('[data-date]'); if (!b) return;
    S.sel = b.dataset.date; paint();
  });
  $('#btn-prev-month').addEventListener('click', ()=>navMonth(-1));
  $('#btn-next-month').addEventListener('click', ()=>navMonth(1));
  $('#month-name').addEventListener('click', ()=>{ S.view = new Date(); calendar(); });
}

async function init() {
  bind();
  try {
    db = await openDB();
    const h = await all(SH);
    S.habits = h.map(r => ({id:r.id, name:r.name, note:r.note||'', at:r.at||r.createdAt||Date.now()}));
    const c = await all(SC);
    S.checkins = new Set(c.map(x=>x.key));
    paint();
  } catch {
    $('#storage-badge').textContent = 'off';
    $('#habit-list').innerHTML = '<div class="loading-msg">Storage unavailable. Use a modern browser.</div>';
  }
}

init();
