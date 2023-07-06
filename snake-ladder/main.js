let diceBox = document.querySelector(".dice-box");
let dice = document.querySelector(".sides");
let player = 3;
let coins = [];
let diceFaces = [
  [-2, 362],
  [272, 2],
  [182, 362],
  [92, 362],
  [2, 92],
  [2, 272],
];

let turn = 0;
let animate = false;

let data = {
  "3,9": [4, 7],
  "0,7": [1, 6],
  "8,7": [6, 2],
  "9,7": [6, 9],
  "2,5": [4, 2],
  "6,5": [5, 8],
  "4,4": [1, 8],
  "2,3": [1, 1],
  "9,2": [8, 1],
  "7,2": [9, 4],
  "1,1": [1, 5],
  "8,0": [5, 2],
  "2,0": [5, 4],
};
let goBack = [];

let coinDelta = 57.2;

coinStyles = [
  [
    "radial-gradient(10px,#00c,#00c,#00c,#00c,#00c,#00c,blue",
    "#0000c2",
    "blue",
  ],
  ["radial-gradient(10px,#c00,#c00,#c00,#c00,#c00,#c00,red", "#c20000", "red"],
  [
    "radial-gradient(10px,#0c0,#0c0,#0c0,#0c0,#0c0,#0c0,green",
    "#00c200",
    "green",
  ],
];

class Coin {
  constructor(i) {
    this.coin = null;
    this.x = 0;
    this.y = 9;
    this.xx = this.x;
    this.yy = this.y;
    this.toggle = true;
    this.name = "";
    this.i = i;
  }
  createCoin() {
    let coin = document.createElement("div");
    let div = document.createElement("div");
    coin.classList.add("coin");
    coin.appendChild(div);
    this.name = coinStyles[this.i][2];
    coin.style.background = coinStyles[this.i][0];
    coin.style.borderColor = coinStyles[this.i][1];
    coin.style.translate = `${this.x * coinDelta}px ${this.y * coinDelta}px`;
    this.coin = coin;
    canva.append(coin);
  }

  setCoinPos() {
    this.coin.style.translate = `${this.x * coinDelta}px ${
      this.y * coinDelta
    }px`;
  }

  bitean() {
    let x = this.xx + "," + this.yy;

    if (this.yy <= 0 && this.xx <= 0) {
      alert(this.name + " you won!");
      game();
      return;
    }
    if (data[x] !== undefined) {
      animate = true;
      this.x = data[x][0];
      this.y = data[x][1];

      setTimeout(() => {
        this.move();
      }, 100);

      setTimeout(() => {
        animate = false;
        this.coin.children[0].classList.remove("active");
        turn = turn === player - 1 ? 0 : turn + 1;
        coins[turn].coin.children[0].classList.add("active");
      }, 500);
      return;
    }

    this.coin.children[0].classList.remove("active");
    turn = turn === player - 1 ? 0 : turn + 1;
    coins[turn].coin.children[0].classList.add("active");
  }

  roll(dice) {
    if (this.y === 0 && 9 - this.xx >= 3)
      if (dice > this.xx) {
        this.coin.children[0].classList.remove("active");
        turn = turn === player - 1 ? 0 : turn + 1;
        coins[turn].coin.children[0].classList.add("active");
        return;
      }

    animate = true;
    let x = 0;
    let timer = setInterval(() => {
      if (x >= dice) {
        clearInterval(timer);
        this.bitean();
        animate = false;
        return;
      } else {
        x++;
        this.move();
      }
    }, 400);
  }

  move() {
    if (this.yy <= 0 && this.xx <= 0) {
      // player--;
      return;
    }
    this.xx = this.x;
    this.yy = this.y;
    this.coin.style.translate = `${this.x * coinDelta}px ${
      this.y * coinDelta
    }px`;

    this.x = this.y % 2 !== 0 ? this.x + 1 : this.x - 1;
    if (this.x < 0 || this.x > 9) {
      this.y--;
      this.x = this.y % 2 !== 0 ? this.x + 1 : this.x - 1;
    }
  }
}

const random = () => {
  return Math.floor(Math.random() * 6 + 1);
};
const game = async () => {
  let canva = document.querySelector("#canva");
  canva.innerHTML = "";
  turn = 0;
  coins = [];
  for (let i = player - 1; i >= 0; i--) {
    let coin = new Coin(i);
    coin.createCoin();
    coins.push(coin);
  }
  coins[0].coin.children[0].classList.add("active");
};
game();

//dice animation
const rollTheDice = (x) => {
  dice.classList.add("animate");

  setTimeout(() => {
    dice.classList.remove("animate");
    dice.style.transform = `rotateX(${diceFaces[x - 1][0]}deg) rotateY(${
      diceFaces[x - 1][1]
    }deg)`;
    coins[turn].roll(x);
  }, 1000);
};

diceBox.addEventListener("mousedown", () => {
  if (animate) return;
  rollTheDice(random());
});

//set coins position on window resize
window.addEventListener("resize", () => {
  coinDelta = window.innerWidth < 450 ? 37.2 : 57.2;
  coins.forEach((coin) => coin.setCoinPos());
});

coinDelta = window.innerWidth < 450 ? 37.2 : 57.2;
coins.forEach((coin) => coin.setCoinPos());
