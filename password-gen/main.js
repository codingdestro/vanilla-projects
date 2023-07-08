let range = document.querySelector(".range input");
let rangeLabel = document.querySelector(".range label");
let options = document.querySelectorAll(".options .checkbox input");
let copyButton = document.querySelector(".box");
let generateButton = document.querySelector(".passButton");
let passwordStrength = document.querySelector(".password-strength span");
let weekness = 1;
let length = parseInt(20 * (range.value / 100));
let lower = "abcdefghijklmnopqrstuvwxyz";
let charators = [
  lower.toLocaleUpperCase(),
  lower,
  "01234567889",
  "!@#$%^&*()_+=-{}]['?/><,.:;\"".toString(),
];

let charSet = { lower: lower };
let Password = document.querySelector(".box input");
let interval = null;
let string = charators[1];

const random = (x) => {
  return Math.floor(Math.random() * x + 1);
};

const copyButtonTimeOut = () => {
  clearTimeout(interval);
  // copyButton.children[1].innerText = "copied";
  copyButton.children[1].style.backgroundImage = "url('./check-mark.png')";
  interval = setTimeout(() => {
    copyButton.children[1].style.backgroundImage = "url('./copy.png')";
  }, 1000);
};

const generate = () => {
  let password = "";
  if (!string.length) alert("select any one option");
  for (let i = 0; i < length; i++) {
    password += string.charAt(random(string.length - 1));
  }
  Password.value = password;
  if (password.length < 6) {
    passwordStrength.innerHTML = "week";
  } else {
    passwordStrength.innerHTML = "strong";
  }
};

const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(copyButton.children[0].value);
    copyButtonTimeOut();
  } catch {
    alert("error to copy");
  }
};

options.forEach((e, idx) => {
  e.addEventListener("click", () => {
    if (string.split(charators[idx]).length > 1) {
      string = string.split(charators[idx]).join("");
    } else {
      string = string.concat(charators[idx]);
    }
  });
});

rangeLabel.innerText = length;
range.addEventListener("input", () => {
  length = parseInt(20 * (range.value / 100));
  rangeLabel.innerText = length;
  generate();
});

generateButton.addEventListener("click", generate);
copyButton.children[1].addEventListener("click", () => {
  copyPassword();
});
