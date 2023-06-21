//variables
const possibleCom = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let roll = "O";
let minInsert = 0;
let score = [0, 0];
let won = false;
let animate = undefined;
let clickable = true;
let player = document.querySelectorAll(".player");
let scorePanel = document.querySelectorAll("#score");
let board = document.querySelector(".board");

//creating a board
for (let i = 0; i < 9; i++) {
  board.innerHTML += `<div class='box ${i}'></div>`;
}
let box = document.querySelectorAll(".box");

const emptyBoard = () => {
  box.forEach((ele) => {
    ele.innerHTML = "";
  });
  minInsert = 0;
};

const eventes = () => {
  scorePanel[0].innerHTML = score[0];
  scorePanel[1].innerHTML = score[1];
};

const toggleScore = () => {
  player[1].classList.toggle("active-player");
  player[0].classList.toggle("active-player");
};

//reset the game

const resetGame = () => {
  emptyBoard();
  score[0] = 0;
  score[1] = 0;
  eventes();
};

document.querySelector(".reset").addEventListener("click", resetGame);

const isWon = () => {
  won = false;
  possibleCom.forEach((element) => {
    if (
      box[element[0]].innerHTML == roll &&
      box[element[1]].innerHTML == roll &&
      box[element[2]].innerHTML == roll
    ) {
      animate = element;
      won = true;
      return;
    }
  });
  if (won) {
    if (roll == "X") {
      score[1] += 1;
    } else {
      score[0] += 1;
    }
    if ((i = score.findIndex((val) => val == 3)) > -1) {
      alert(`player ${i + 1} won the match`);
      resetGame();
    } else {
      clickable = false;
      eventes();
      animation();
      clearAnimation();
    }
  }
};

box.forEach((pos, idx) => {
  pos.addEventListener("click", () => {
    insertRoll(idx);
  });
});

//game click event
const insertRoll = (idx) => {
  if (box[idx].innerHTML == "" && clickable) {
    box[idx].innerHTML = roll;
    minInsert += 1;
    minInsert > 4 && isWon();
    roll = roll == "O" ? "X" : "O";
    toggleScore();
  }
  if (minInsert == 9 && won == false) {
    draw();
    clickable = false;
    clearDraw();
  }
};

//hello my name ismohd anas how you doing today
//animation if player wins
const animation = () => {
  box[animate[0]].classList.toggle("active");
  box[animate[1]].classList.toggle("active");
  box[animate[2]].classList.toggle("active");
};

//draw match
const draw = () => {
  box.forEach((ele) => {
    ele.classList.toggle("error");
  });
};

const clearAnimation = () => {
  setTimeout(() => {
    animation();
    emptyBoard();
    clickable = true;
  }, 1000);
};

const clearDraw = () => {
  setTimeout(() => {
    draw();
    emptyBoard();
    clickable = true;
  }, 1000);
};
