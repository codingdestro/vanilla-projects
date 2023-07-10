let ways = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [1, 1],
];

let board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];
let yPos = [5, 5, 5, 5, 5, 5, 5];

let box = document.querySelector(".board");
let playerBox = [
  document.querySelector(".player-box .player #p1"),
  document.querySelector(".player-box .player #p2"),
];
let turn = true;
let sec = 15;
let filled = 0;
let canClick = true;
let buttons = null;

const togglePlayer = () => {
  document
    .querySelectorAll(".player-box .player")[0]
    .classList.toggle("active");
  document
    .querySelectorAll(".player-box .player")[1]
    .classList.toggle("active");
  turn = !turn;
};

const createBoard = () => {
  for (let i = 0; i < 42; i++) {
    let holes = document.createElement("div");
    holes.classList.add("holes");
    box.appendChild(holes);
  }
  for (let i = 0; i <= 6; i++) {
    let button = document.createElement("div");
    button.classList.add("button");
    button.style.translate = `${54 * i}px  0px`;
    box.appendChild(button);
  }
  buttons = document.querySelectorAll(".button");
};

const matching = (crr, point, x, i) => {
  if (i == 0) return true;
  let pos = [crr[0] + ways[x][0], crr[1] + ways[x][1]];
  if (pos[0] >= 0 && pos[0] <= 6 && pos[1] >= 0 && pos[1] <= 5) {
    if (board[pos[1]][pos[0]] === point) {
      return matching(pos, point, x, i - 1);
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const checkSibling = (crr = [], point) => {
  for (let i = 0; i < ways.length; i++) {
    let pos = [crr[0] + ways[i][0], crr[1] + ways[i][1]];
    if (pos[0] >= 0 && pos[0] < 7 && pos[1] >= 0 && pos[1] < 6) {
      if (board[pos[1]][[pos[0]]] !== point) continue;
      if (matching(pos, point, i, 2)) return true;
    }
  }
};

const addCoin = (x) => {
  if (yPos[x] < 0) return;
  canClick = false;
  let tr = turn ? "red" : "blue";
  let coin = document.createElement("div");
  coin.classList.add("coin");
  coin.classList.add(tr);
  coin.style.translate = `${x * 54}px ${yPos[x] * 54}px`;
  box.appendChild(coin);
  filled += 1;
  board[yPos[x]][x] = tr;
  if (filled > 6) {
    if (checkSibling([x, yPos[x]], tr)) {
      if (tr === "blue") {
        playerBox[0].innerHTML = parseInt(playerBox[0].innerText) + 1;
      } else {
        playerBox[1].innerHTML = parseInt(playerBox[1].innerText) + 1;
      }
      setTimeout(() => {
        reset();
      }, 1000);
    }
  }
  yPos[x] -= 1;
  // turn = !turn;
  togglePlayer();
  sec = 15;
  canClick = true;
};
const reset = () => {
  box.innerHTML = "";
  createBoard();
  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  yPos = [5, 5, 5, 5, 5, 5, 5];
  // turn = !turn;
  togglePlayer();
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
      if (canClick) addCoin(i);
    });
  }
};
reset();

let counter = document.querySelector(".time");
let interval = setInterval(() => {
  counter.innerHTML = `${sec}s`;
  if (sec === 0) {
    sec = 15;
    // turn = !turn;
    togglePlayer();
  }
  sec--;
}, 1000);
