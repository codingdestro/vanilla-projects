const boxTypes = [
  "horse",
  "apple",
  "bomb",
  "cards",
  "cherry",
  "king",
  "penguine",
  "treasure",
];
let boxes = [];
let disable = true;
let prev = null;
let score = 0;
let scoreBox = document.querySelector(".score span");
let health = 10;
let healthBox = document.querySelectorAll(".score span")[1];
boxes.push(...boxTypes);
boxes.push(...boxTypes);
let boxEvent = document.querySelectorAll(".box");

const random = () => {
  return Math.floor(Math.random() * 15);
};
const shuffle = () => {
  for (let i = 0; i < 16; i++) {
    let x = random();
    let y = random();
    let tmp = boxes[x];
    boxes[x] = boxes[y];
    boxes[y] = tmp;
  }
};

const setDisable = () => {
  disable = true;
  setTimeout(() => (disable = false), 500);
};

const clearAnimation = (prev, idx, className, t = 300) => {
  setTimeout(() => {
    boxEvent[prev].classList.remove(className);
    boxEvent[idx].classList.remove(className);
  }, t);
};

const addAnimation = (prev, idx, className, t = 500) => {
  setTimeout(() => {
    boxEvent[prev].classList.add(className);
    boxEvent[idx].classList.add(className);
  }, t);
};

const gameOver = () => {
  disable = true;
  setTimeout(() => {
    alert("game over");
    reset();
  }, 400);
};

const updateHealth = () => {
  health--;
  healthBox.innerHTML = health;
};
const flip = (idx) => {
  if (prev == null) {
    prev = idx;
    boxEvent[prev].classList.add("select");
  } else {
    if (prev == idx) return;
    boxEvent[idx].classList.add("select");
    if (boxes[prev] !== boxes[idx]) {
      boxEvent[prev].classList.add("active");
      boxEvent[idx].classList.add("active");
      updateHealth();
      clearAnimation(prev, idx, "active");
      if (health == 0) {
        gameOver();
        return;
      }
    } else {
      if (boxes[prev] === "bomb" && boxes[idx] === "bomb") {
        gameOver();
        return;
      } else {
        score++;
        scoreBox.innerHTML = score;
        addAnimation(prev, idx, "match");
      }
    }
    clearAnimation(prev, idx, "select", 500);
    prev = null;
    if (score == 7) {
      setTimeout(() => {
        reset();
      }, 1000);
    }
  }
};

const createBoard = () => {
  let board = document.querySelector(".container");

  for (let i = 0; i < 16; i++) {
    let box = document.createElement("div");
    box.style.backgroundImage = `url(./assets/${boxes[i]}.png)`;
    box.classList.add("box");
    board.append(box);
  }

  board = document.querySelector(".container");

  setTimeout(() => board.classList.toggle("show"), 100);
  setTimeout(() => {
    board.classList.toggle("show");
    disable = false;
  }, 1000);

  boxEvent = document.querySelectorAll(".box");

  boxEvent.forEach((box, idx) => {
    box.addEventListener("click", () => {
      if (disable || box.classList.contains("match")) return;
      flip(idx);
      setDisable();
    });
  });
};

shuffle();
createBoard();

const reset = () => {
  document.querySelector(".container").innerHTML = "";
  prev = null;
  score = 0;
  health = 10;
  scoreBox.innerHTML = score;
  healthBox.innerHTML = health;
  shuffle();
  createBoard();
};

document.querySelector(".reset").addEventListener("click", reset);
