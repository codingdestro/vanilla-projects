const buttons = document.querySelectorAll(".btn");
const display = document.querySelectorAll(".display")[0];
let a = "";
let b = "";
let c = 0;
let ope = "";

const calculate = () => {
  c = 0;
  if (ope == "+") {
    c = parseFloat(a) + parseFloat(b);
  } else if (ope == "-") {
    c = parseFloat(a) - parseFloat(b);
  } else if (ope == "x") {
    c = parseFloat(a) * parseFloat(b);
  } else if (ope == "/") {
    c = parseFloat(a) / parseFloat(b);
  }
  a = "";
  b = c;
  ope = "";
  toScreen("");
};

const toScreen = (text) => {
  b += text;
  display.value = a + ope + b;
};

const addOpe = (operator) => {
  if (ope == "" && a == "") {
    a = b;
    b = "";
    ope = operator;
    toScreen("");
  } else {
    ope = operator;
    toScreen("");
  }
};

const addDot = () => {
  if (b.indexOf(".") < 0) {
    toScreen(".");
  }
};

const backspace = () => {
  if (b != "") {
    b = b.slice(0, b.length - 1);
  } else if (ope != "") {
    ope = "";
  } else {
    b = a;
    a = "";
  }
  toScreen("");
};

const handler = (id, text) => {
  switch (id) {
    case "ope":
      addOpe(text);
      break;
    case "clear":
      a = "0";
      ope = "";
      b = "";
      toScreen("");
      break;
    case "backspace":
      backspace();
      break;
    case "dot":
      addDot();
      break;
    case "equal":
      calculate();
      break;
    default:
      toScreen(text);
  }
};

buttons.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    handler(btn.id, btn.innerHTML);
  });
});
