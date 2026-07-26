const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

const monthYearEl = document.getElementById("monthYear");
const daysGridEl = document.getElementById("daysGrid");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

function createDay(text, ...classes) {
  const el = document.createElement("div");
  el.classList.add("day", ...classes);
  el.textContent = text;
  return el;
}

function render() {
  monthYearEl.textContent = `${MONTHS[currentMonth]} ${currentYear}`;
  daysGridEl.innerHTML = "";

  const today = new Date();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = createDay(daysInPrevMonth - i, "day--other");
    day.addEventListener("click", goToPrevMonth);
    daysGridEl.appendChild(day);
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(currentYear, currentMonth, d).getDay();
    const classes = [];

    if (
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    ) {
      classes.push("day--today");
    }
    if (dayOfWeek === 0) classes.push("day--sunday");
    if (dayOfWeek === 6) classes.push("day--saturday");

    daysGridEl.appendChild(createDay(d, ...classes));
  }

  // Next month leading days
  const totalCells = daysGridEl.children.length;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    const day = createDay(i, "day--other");
    day.addEventListener("click", goToNextMonth);
    daysGridEl.appendChild(day);
  }
}

function goToNextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  render();
}

function goToPrevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  render();
}

prevBtn.addEventListener("click", goToPrevMonth);
nextBtn.addEventListener("click", goToNextMonth);

render();
