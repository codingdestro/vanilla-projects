// ── State ────────────────────────────────────────────────────────────

let playerCount = 2;
let coins = [];
let turn = 0;
let animate = false;
let won = false;
let coinDelta = 57.2;

const diceFaces = [
  [-2, 362],
  [272, 2],
  [182, 362],
  [92, 362],
  [2, 92],
  [2, 272],
];

const coinColors = ["red", "blue", "green"];
const coinNames = ["Red", "Blue", "Green"];
const coinStyles = [
  "radial-gradient(circle at 35% 30%, #ffffff, #f5c6c6, #c00000)",
  "radial-gradient(circle at 35% 30%, #ffffff, #c6d6f5, #1a4ec0)",
  "radial-gradient(circle at 35% 30%, #ffffff, #c6f5d0, #1a8a3a)",
];

// Verified against board1.png and board2.png. cx 0-9 left-to-right, cy 9 bottom.
const boardData = [
  {
    "3,9": [4, 7], "0,7": [1, 6], "8,7": [6, 2], "9,7": [6, 9],
    "2,5": [4, 2], "6,5": [5, 8], "4,4": [1, 8], "2,3": [0, 2],
    "9,2": [8, 1], "7,2": [9, 4], "1,1": [1, 5], "8,0": [5, 2],
    "2,0": [5, 4],
  },
  {
    "0,9": [2, 6], "3,9": [6, 8], "8,9": [9, 6], "3,8": [6, 9],
    "0,7": [1, 5], "7,7": [3, 1], "9,4": [6, 3], "6,4": [6, 6],
    "1,3": [1, 8], "3,3": [0, 4], "9,2": [9, 0], "0,2": [0, 0],
    "6,1": [3, 7], "7,0": [7, 2], "5,0": [5, 2], "2,0": [1, 2],
  },
];

let data = {};

// ── DOM ──────────────────────────────────────────────────────────────

const canva = document.getElementById("canva");
const playerList = document.getElementById("playerList");
const diceBox = document.getElementById("diceBox");
const diceSides = document.querySelector(".sides");
const snakeFeedback = document.getElementById("snakeFeedback");
const playerSelect = document.getElementById("playerSelect");
const victoryOverlay = document.getElementById("victoryOverlay");
const victoryHeading = document.getElementById("victoryHeading");
const victorySub = document.getElementById("victorySub");
const playAgainBtn = document.getElementById("playAgain");

// ── Helpers ──────────────────────────────────────────────────────────

const cellNumber = (cx, cy) =>
  (9 - cy) * 10 + (cy % 2 === 1 ? cx + 1 : 10 - cx);

const randomTheme = () => {
  const x = Math.floor(Math.random() * 2);
  canva.style.backgroundImage = `url(${x ? "board2.png" : "board1.png"})`;
  data = boardData[x];
};

const updateCoinDelta = () => {
  if (canva.clientWidth > 0) coinDelta = canva.clientWidth / 10;
};

const renderPlayerPanel = () => {
  playerList.innerHTML = "";
  for (let i = 0; i < playerCount; i++) {
    const li = document.createElement("li");
    li.className = "player-item";
    li.id = "playerRow" + i;
    li.innerHTML = `
      <span class="player-dot" style="background:${coinStyles[i]}"></span>
      <span>${coinNames[i]}</span>
      <span class="player-cell" id="playerCell${i}">1</span>
    `;
    playerList.appendChild(li);
  }
  updateTurnHighlight();
};

const updateTurnHighlight = () => {
  for (let i = 0; i < playerCount; i++) {
    const row = document.getElementById("playerRow" + i);
    if (row) row.classList.toggle("current-turn", i === turn);
  }
};

const updatePlayerCell = (i, cell) => {
  const el = document.getElementById("playerCell" + i);
  if (el) el.textContent = cell;
};

const showVictory = (name) => {
  won = true;
  animate = false;
  victoryHeading.textContent = name + " wins!";
  victorySub.textContent = "Great race to the top.";
  victoryOverlay.hidden = false;
};

const hideVictory = () => {
  victoryOverlay.hidden = true;
  won = false;
};

const showSnakeFeedback = (fromCell, toCell) => {
  const goingUp = toCell > fromCell;
  snakeFeedback.textContent = goingUp
    ? `Ladder! Up to ${toCell}`
    : `Snake! Down to ${toCell}`;
  snakeFeedback.className =
    "snake-feedback show " + (goingUp ? "is-ladder" : "is-snake");
  clearTimeout(snakeFeedback._timeout);
  snakeFeedback._timeout = setTimeout(() => {
    snakeFeedback.className = "snake-feedback";
  }, 2200);
};

// ── Coin ─────────────────────────────────────────────────────────────

class Coin {
  constructor(i) {
    this.i = i;
    this.cx = 0;
    this.cy = 9;
    this.name = coinNames[i];
    this.style = coinStyles[i];
    this.coin = null;
  }

  cell() {
    return cellNumber(this.cx, this.cy);
  }

  createCoin() {
    const el = document.createElement("div");
    el.className = "coin";
    el.style.background = this.style;
    this.coin = el;
    canva.appendChild(el);
    this.render();
  }

  render() {
    this.coin.style.translate =
      `${this.cx * coinDelta}px ${this.cy * coinDelta}px`;
    updatePlayerCell(this.i, this.cell());
  }

  // Advance exactly one cell along the boustrophedon path.
  step() {
    if (this.cell() >= 100) return false;
    if (this.cy % 2 === 1) {
      this.cx++;
      if (this.cx > 9) {
        this.cx = 9;
        this.cy--;
      }
    } else {
      this.cx--;
      if (this.cx < 0) {
        this.cx = 0;
        this.cy--;
      }
    }
    this.render();
    return true;
  }

  setActive() {
    turn = turn === playerCount - 1 ? 0 : turn + 1;
    coins.forEach((c, i) =>
      c.coin.classList.toggle("active-coin", i === turn)
    );
    updateTurnHighlight();
  }

  roll(diceVal) {
    // Exact-finish rule: a roll that overshoots 100 passes the turn.
    if (this.cell() + diceVal > 100) {
      animate = false;
      this.setActive();
      return;
    }

    let steps = 0;
    const timer = setInterval(() => {
      if (steps >= diceVal) {
        clearInterval(timer);
        this.resolveLanding();
        return;
      }
      steps++;
      this.step();
    }, 380);
  }

  resolveLanding() {
    if (this.cell() === 100) {
      showVictory(this.name);
      return;
    }

    const jump = data[this.cx + "," + this.cy];
    if (jump) {
      const fromCell = this.cell();
      const [nx, ny] = jump;
      const toCell = cellNumber(nx, ny);
      const isSnake = toCell < fromCell;

      this.coin.classList.add(isSnake ? "snake-move" : "ladder-move");

      setTimeout(() => {
        this.cx = nx;
        this.cy = ny;
        this.render();
      }, 220);

      setTimeout(() => {
        this.coin.classList.remove("snake-move", "ladder-move");
        showSnakeFeedback(fromCell, toCell);
      }, 520);

      setTimeout(() => {
        if (this.cell() === 100) {
          showVictory(this.name);
          return;
        }
        animate = false;
        this.setActive();
      }, 850);
      return;
    }

    animate = false;
    this.setActive();
  }
}

// ── Dice ─────────────────────────────────────────────────────────────

const rollDice = () => Math.floor(Math.random() * 6) + 1;

const rollTheDice = (value) => {
  if (animate || won) return;
  animate = true;
  diceSides.classList.add("animate");
  setTimeout(() => {
    diceSides.classList.remove("animate");
    diceSides.style.transform =
      `rotateX(${diceFaces[value - 1][0]}deg) rotateY(${diceFaces[value - 1][1]}deg)`;
    coins[turn].roll(value);
  }, 1000);
};

// ── Game lifecycle ───────────────────────────────────────────────────

const startGame = () => {
  hideVictory();
  canva.innerHTML = "";
  turn = 0;
  animate = false;
  coins = [];
  snakeFeedback.className = "snake-feedback";
  updateCoinDelta();
  renderPlayerPanel();
  for (let i = 0; i < playerCount; i++) {
    const coin = new Coin(i);
    coin.createCoin();
    coins.push(coin);
  }
  if (coins[0]) coins[0].coin.classList.add("active-coin");
  updateTurnHighlight();
};

// ── Events ───────────────────────────────────────────────────────────

diceBox.addEventListener("click", () => {
  if (animate || won) return;
  rollTheDice(rollDice());
});

document.addEventListener("keydown", (e) => {
  if ((e.code === "Space" || e.code === "Enter") && !won) {
    e.preventDefault();
    if (playerSelect.classList.contains("hidden")) {
      rollTheDice(rollDice());
    }
  }
});

document.querySelectorAll(".pick-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    playerCount = parseInt(btn.dataset.players, 10);
    playerSelect.classList.add("hidden");
    startGame();
  });
});

playAgainBtn.addEventListener("click", () => {
  hideVictory();
  randomTheme();
  startGame();
});

window.addEventListener("resize", () => {
  updateCoinDelta();
  coins.forEach((c) => c.render());
});

// ── Init ─────────────────────────────────────────────────────────────

randomTheme();
updateCoinDelta();

// Test hook: ?test=auto starts 2-player game; ?test=roll triggers a roll.
const testParam = new URLSearchParams(location.search).get("test");
if (testParam === "auto" || testParam === "roll" || testParam === "won") {
  playerCount = 2;
  playerSelect.classList.add("hidden");
  startGame();
  if (testParam === "roll") {
    setTimeout(() => rollTheDice(rollDice()), 200);
  } else if (testParam === "won") {
    setTimeout(() => {
      coins[0].cx = 0;
      coins[0].cy = 0;
      coins[0].render();
      setTimeout(() => coins[0].resolveLanding(), 300);
    }, 200);
  }
}
