const box = document.querySelector(".box");

for (let i = 0; i < 42; i++) {
  let ele = document.createElement("div");
  ele.classList.add("cols");
  box.appendChild(ele);
}
