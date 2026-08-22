const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const keys = new Set();
const shipImage = new Image();
shipImage.src = "cursor.png";
const bombImage = new Image();
bombImage.src = "bomb.png";

let state = "start";
let score = 0;
let lives = 3;
let level = 1;
let spawnTimer = 0;
let shotTimer = 0;
let powerUpSpawnTimer = 4;
let powerUpTimer = 0;
let lastTime = 0;
let pointerX = null;
let bullets = [];
let enemies = [];
let powerUps = [];
let particles = [];
let stars = [];

for (let i = 0; i < 70; i += 1) {
  stars.push({
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 35 + 15,
  });
}

const ship = {
  x: WIDTH / 2 - 18,
  y: HEIGHT - 62,
  width: 36,
  height: 36,
  speed: 270,
};

function resetGame() {
  state = "playing";
  score = 0;
  lives = 3;
  level = 1;
  spawnTimer = 0;
  shotTimer = 0;
  powerUpSpawnTimer = 4;
  powerUpTimer = 0;
  bullets = [];
  enemies = [];
  powerUps = [];
  particles = [];
  ship.x = WIDTH / 2 - ship.width / 2;
}

function startOrRestart() {
  if (state !== "playing") resetGame();
}

function shoot() {
  const shots = powerUpTimer > 0 ? [-110, 0, 110] : [0];
  shots.forEach((vx) => {
    bullets.push({
      x: ship.x + ship.width / 2,
      y: ship.y + 2,
      speed: 430,
      vx,
    });
  });
}

function spawnEnemy() {
  const size = 24;
  enemies.push({
    x: Math.random() * (WIDTH - size),
    y: -size,
    width: size,
    height: size,
    speed: 75 + level * 12 + Math.random() * 35,
    frame: 0,
  });
}

function spawnPowerUp() {
  const size = 20;
  powerUps.push({
    x: Math.random() * (WIDTH - size),
    y: -size,
    width: size,
    height: size,
    speed: 65 + Math.random() * 25,
    pulse: 0,
  });
}

function burst(x, y, color) {
  for (let i = 0; i < 10; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    particles.push({
      x,
      y,
      dx: Math.cos(angle) * (35 + Math.random() * 75),
      dy: Math.sin(angle) * (35 + Math.random() * 75),
      life: 0.45,
      color,
    });
  }
}

function overlaps(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function updateStars(dt) {
  stars.forEach((star) => {
    star.y += star.speed * dt;
    if (star.y > HEIGHT) star.y = 0;
  });
}

function update(dt) {
  updateStars(dt);
  particles = particles.filter((particle) => {
    particle.x += particle.dx * dt;
    particle.y += particle.dy * dt;
    particle.life -= dt;
    return particle.life > 0;
  });

  if (state !== "playing") return;

  powerUpTimer = Math.max(0, powerUpTimer - dt);
  let direction = 0;
  if (keys.has("ArrowLeft") || keys.has("a")) direction -= 1;
  if (keys.has("ArrowRight") || keys.has("d")) direction += 1;
  ship.x += direction * ship.speed * dt;
  if (pointerX !== null) {
    ship.x += (pointerX - (ship.x + ship.width / 2)) * Math.min(1, dt * 10);
  }
  ship.x = Math.max(0, Math.min(WIDTH - ship.width, ship.x));

  shotTimer -= dt;
  if (shotTimer <= 0) {
    shoot();
    shotTimer = 0.22;
  }

  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnEnemy();
    spawnTimer = Math.max(0.28, 0.9 - level * 0.045);
  }

  powerUpSpawnTimer -= dt;
  if (powerUpSpawnTimer <= 0 && powerUps.length === 0) {
    spawnPowerUp();
    powerUpSpawnTimer = 8 + Math.random() * 5;
  }

  bullets = bullets.filter((bullet) => {
    bullet.y -= bullet.speed * dt;
    bullet.x += bullet.vx * dt;
    return bullet.y > -10 && bullet.x > -10 && bullet.x < WIDTH + 10;
  });

  powerUps = powerUps.filter((powerUp) => {
    powerUp.y += powerUp.speed * dt;
    powerUp.pulse += dt * 7;
    if (overlaps(ship, powerUp)) {
      powerUpTimer = 8;
      burst(
        powerUp.x + powerUp.width / 2,
        powerUp.y + powerUp.height / 2,
        "#8b5cf6",
      );
      return false;
    }
    return powerUp.y < HEIGHT;
  });

  enemies = enemies.filter((enemy) => {
    enemy.y += enemy.speed * dt;
    enemy.frame = (enemy.frame + dt * 8) % 4;
    if (overlaps(ship, enemy)) {
      burst(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, "#ff5b5b");
      lives = Math.max(0, lives - 1);
      if (lives <= 0) state = "gameover";
      return false;
    }
    if (enemy.y > HEIGHT) {
      lives = Math.max(0, lives - 1);
      if (lives <= 0) state = "gameover";
      return false;
    }
    return true;
  });

  bullets = bullets.filter((bullet) => {
    const hitIndex = enemies.findIndex((enemy) =>
      overlaps(
        { x: bullet.x - 2, y: bullet.y - 7, width: 4, height: 10 },
        enemy,
      ),
    );
    if (hitIndex === -1) return true;
    const [hit] = enemies.splice(hitIndex, 1);
    score += 10;
    level = 1 + Math.floor(score / 100);
    burst(hit.x + hit.width / 2, hit.y + hit.height / 2, "#ffd166");
    return false;
  });
}

function drawBackground() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  stars.forEach((star) => {
    ctx.fillStyle = `rgba(90, 110, 140, ${0.35 + star.size / 4})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

function drawShip() {
  if (shipImage.complete && shipImage.naturalWidth > 0) {
    ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);
  } else {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(ship.x + ship.width / 2, ship.y);
    ctx.lineTo(ship.x, ship.y + ship.height);
    ctx.lineTo(ship.x + ship.width, ship.y + ship.height);
    ctx.closePath();
    ctx.fill();
  }
}

function draw() {
  drawBackground();
  bullets.forEach((bullet) => {
    ctx.fillStyle = "#d4af37";
    ctx.fillRect(bullet.x - 2, bullet.y - 8, 4, 10);
  });
  enemies.forEach((enemy) => {
    if (bombImage.complete && bombImage.naturalWidth > 0) {
      ctx.drawImage(
        bombImage,
        Math.floor(enemy.frame) * 42,
        0,
        42,
        42,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height,
      );
    } else {
      ctx.fillStyle = "#000";
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
  powerUps.forEach((powerUp) => {
    const glow = 5 + Math.sin(powerUp.pulse) * 2;
    ctx.fillStyle = "rgba(139, 92, 246, 0.2)";
    ctx.beginPath();
    ctx.arc(
      powerUp.x + powerUp.width / 2,
      powerUp.y + powerUp.height / 2,
      powerUp.width / 2 + glow,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.fillStyle = "#8b5cf6";
    ctx.beginPath();
    ctx.arc(
      powerUp.x + powerUp.width / 2,
      powerUp.y + powerUp.height / 2,
      powerUp.width / 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "+",
      powerUp.x + powerUp.width / 2,
      powerUp.y + powerUp.height / 2 + 5,
    );
    ctx.textAlign = "left";
  });
  particles.forEach((particle) => {
    ctx.globalAlpha = Math.max(0, particle.life / 0.45);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, 3, 3);
  });
  ctx.globalAlpha = 1;
  if (state === "playing") drawShip();

  ctx.fillStyle = "#000";
  ctx.font = "bold 16px system-ui, sans-serif";
  ctx.fillText(`SCORE ${score}`, 14, 26);
  ctx.fillStyle = "#dc2626";
  ctx.fillText(`LIVES ${"♥".repeat(lives)}`, WIDTH - 112, 26);
  ctx.font = "13px system-ui, sans-serif";
  ctx.fillStyle = "#000";
  ctx.fillText(`LEVEL ${level}`, 14, 46);
  if (powerUpTimer > 0) {
    ctx.fillStyle = "#8b5cf6";
    ctx.fillText(`POWER ${Math.ceil(powerUpTimer)}s`, 14, 64);
  }

  if (state !== "playing") {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.textAlign = "center";
    ctx.fillStyle = "#164e63";
    ctx.font = "bold 34px system-ui, sans-serif";
    ctx.fillText(
      state === "start" ? "SPACE SHOOTER" : "GAME OVER",
      WIDTH / 2,
      HEIGHT / 2 - 35,
    );
    ctx.fillStyle = "#172033";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText(
      state === "start"
        ? "Press ENTER or tap to start"
        : `Final score: ${score}`,
      WIDTH / 2,
      HEIGHT / 2 + 5,
    );
    ctx.fillStyle = "#52627a";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText(
      state === "start"
        ? "A/D or arrows to move • Auto-fire • Collect purple power balls"
        : "Press ENTER or tap to play again",
      WIDTH / 2,
      HEIGHT / 2 + 32,
    );
    ctx.textAlign = "left";
  }
}

function animate(time) {
  const dt = Math.min(0.05, (time - lastTime) / 1000 || 0);
  lastTime = time;
  update(dt);
  draw();
  requestAnimationFrame(animate);
}

window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", " ", "Enter"].includes(event.key))
    event.preventDefault();
  if (event.key === "Enter") startOrRestart();
  keys.add(event.key);
});

window.addEventListener("keyup", (event) => keys.delete(event.key));

canvas.addEventListener("pointerdown", (event) => {
  if (state !== "playing") {
    startOrRestart();
    return;
  }
  pointerX = (event.offsetX / canvas.clientWidth) * WIDTH;
  shoot();
});

canvas.addEventListener("pointermove", (event) => {
  if (state === "playing")
    pointerX = (event.offsetX / canvas.clientWidth) * WIDTH;
});

canvas.addEventListener("pointerleave", () => {
  pointerX = null;
});

requestAnimationFrame(animate);
