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
  document.querySelector(".countdown .heading").innerText = turn
    ? "player 1's turn"
    : "player 2'nd turn";
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

const checkHori = (f) => {
  for (let x = 0; x < board.length; x++) {
    for (i = 0; i < 4; i++) {
      if (
        board[x][i] === f &&
        board[x][i + 1] === f &&
        board[x][i + 2] === f &&
        board[x][i + 3] === f
      ) {
        return [
          [x, i],
          [x, i + 1],
          [x, i + 2],
          [x, i + 3],
        ];
      }
    }
  }
  return false;
};

const checkVer = (f) => {
  for (let x = 0; x < board.length; x++) {
    for (i = 0; i < 3; i++) {
      if (
        board[i][x] === f &&
        board[i + 1][x] === f &&
        board[i + 2][x] === f &&
        board[i + 3][x] === f
      ) {
        return [
          [i, x],
          [i + 1, x],
          [i + 2, x],
          [i + 3, x],
        ];
      }
    }
  }
  return false;
};

const diognal = (y, x, d, f) => {
  while (y + 3 < 6) {
    if (
      board[y][x] === f &&
      board[y + 1][x + d * 1] === f &&
      board[y + 2][x + d * 2] === f &&
      board[y + 3][x + d * 3] === f
    ) {
      return [
        [y, x],
        [y + 1, x + d * 1],
        [y + 2, x + d * 2],
        [y + 3, x + d * 3],
      ];
    }
    y += 1;
    x += d;
  }
};

const checkDiognal = (f) => {
  for (let i = 0; i < 3; i++) {
    let x = diognal(i, 0, 1, f);
    if (x) return x;
    x = diognal(i, 6, -1, f);
    if (x) return x;
  }

  for (let i = 1; i < 4; i++) {
    let x = diognal(0, i, 1, f);
    if (x) return x;
    x = diognal(0, 6 - i, -1, f);
    if (x) return x;
  }

  return false;
};

const createWonCoin = (arr = []) => {
  for (let i = 0; i < arr.length; i++) {
    let [x, y] = arr[i];
    let ele = document.createElement("div");
    ele.classList.add("won_coin");
    ele.style.translate = `${y * 54}px ${x * 54}px`;
    box.appendChild(ele);
  }
};

const whoWon = (turn) => {
  let x = checkHori(turn);
  if (x) return x;
  x = checkVer(turn);
  if (x) return x;
  x = checkDiognal(turn);
  if (x) return x;
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
    if (filled === 42) {
      alert("match tie");
      canClick = false;
      setTimeout(() => {
        reset();
        canClick = true;
      }, 2000);
      return;
    }

    let arr = whoWon(tr);
    if (arr) {
      createWonCoin(arr);
      if (tr === "blue") {
        playerBox[0].innerHTML = parseInt(playerBox[0].innerText) + 1;
      } else {
        playerBox[1].innerHTML = parseInt(playerBox[1].innerText) + 1;
      }
      canClick = false;
      setTimeout(() => {
        reset();
        canClick = true;
      }, 2000);
    } else {
      canClick = true;
    }
  } else {
    canClick = true;
  }
  yPos[x] -= 1;
  togglePlayer();
  sec = 15;
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
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
      if (canClick) addCoin(i);
    });
  }
  sec = 15;
};
reset();

let counter = document.querySelector(".time");
let interval = setInterval(() => {
  counter.innerHTML = `${sec}s`;
  if (sec === 0) {
    sec = 15;
    togglePlayer();
  }
  sec--;
}, 1000);
