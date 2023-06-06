let body = document.querySelector(".body");
let arr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];

for (let i = 0; i < 12; i++) {
  body.innerHTML += `<div class="numbers"><div class="sub">${arr[i]}</div></div>`;
}

let no = document.querySelectorAll(".numbers");
let sub = document.querySelectorAll(".sub");

for (let i = 0; i < 12; i++) {
  no[i].style.transform = `rotate(${30 * i}deg)`;
  sub[i].style.transform = `rotate(${30 * i * -1}deg)`;
}

let sec = document.querySelector(".sec");
let min = document.querySelector(".min");
let hour = document.querySelector(".hour");

setInterval(() => {
  let seconds = new Date().getSeconds();
  let minutes = new Date().getMinutes();
  let hours = new Date().getHours();
  sec.style.transform = `rotate(${-90 + 6 * seconds}deg)`;
  min.style.transform = `rotate(${-90 + 6 * minutes}deg)`;
  hour.style.transform = `rotate(${-90 + 30 * hours}deg)`;
}, 100);
