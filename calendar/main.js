const Months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

let date = new Date();
let crrYear = date.getFullYear();
let crrMonth = date.getMonth();

const goToNextMonth = () => {
  if (crrMonth > 11) {
    date = new Date(crrYear + 1, 0);
  } else {
    date = new Date(crrYear, crrMonth + 1);
  }
  crrYear = date.getFullYear();
  crrMonth = date.getMonth();
  setDate();
};

const goToPrevMonth = () => {
  if (crrMonth < 0) {
    date = new Date(crrYear - 1, 0);
  } else {
    date = new Date(crrYear, crrMonth - 1);
  }
  crrYear = date.getFullYear();
  crrMonth = date.getMonth();
  setDate();
};

const setElement = (date, className = "", func) => {
  let ele = document.createElement("div");
  ele.innerText = date;
  ele.addEventListener("click", func)
  className && ele.classList.add(className);
  return ele;
};

//element
let buttons = document.querySelectorAll(".button");

const setDate = () => {
  let day = document.querySelector(".date");
  let year = document.querySelector(".year");
  year.innerHTML = `${Months[crrMonth]} ${crrYear}`;
  let firstDayOfMonth = new Date(crrYear, crrMonth + 1, 0);
  let prevMonth = new Date(crrYear, crrMonth, false);
  day.innerHTML = "";

  for (
    i = prevMonth.getDate() - prevMonth.getDay();
    i <= prevMonth.getDate();
    i++
  ) {
    day.append(setElement(i, "prev",goToPrevMonth));
  }

  let x = 0;

  for (i = 1; i <= firstDayOfMonth.getDate(); i++) {
    let d = new Date();
    let ele = null;
    if (
      d.getDate() == i &&
      d.getFullYear() == date.getFullYear() &&
      d.getMonth() == date.getMonth()
    ) {
      ele = setElement(i, "current");
    } else {
      ele = setElement(i);
    }
    day.append(ele);
  }

  for (i = 1; i <= 6 - firstDayOfMonth.getDay(); i++) {
    day.append(setElement(i, "prev",goToNextMonth));
  }

  for (let i = 1; i <= 5; i++) {
    day.children[x].setAttribute("style", "background:rgba(255, 0, 0, 0.767);");
    x = i * 7;
  }
};
setDate();

//buttons for changing months
buttons[0].addEventListener("click", goToPrevMonth);
buttons[1].addEventListener("click", goToNextMonth);
