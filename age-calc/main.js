let yearInputBox = document.querySelector("#yearInput");
let monthInputBox = document.querySelector("#monthInput");
let dayInputBox = document.querySelector("#dayInput");

let lastYearValue = 2002;
let lastMonthValue = 5;
let lastDayValue = new Date(lastYearValue, lastMonthValue - 1, 0).getDate();

const udpateLastValue = () => {
  lastDayValue = new Date(lastYearValue, lastMonthValue, 0).getDate();
  dayInputBox.value = lastDayValue;
};

const calculateAge = () => {
  let crrDate = new Date().toLocaleDateString().split("/");

  let yearComment = document.querySelectorAll(".year div");
  let dayComment = document.querySelectorAll(".day div");
  let monthComment = document.querySelectorAll(".month div");

  let dy, mth, yr;

  if (dayInputBox.value > crrDate[0]) {
    crrDate[0] =
      parseInt(crrDate[0]) + new Date(crrDate[2], crrDate[1] - 1, 0).getDate();
    crrDate[1]--;
    console.log(crrDate);
  }

  if (monthInputBox.value > parseInt(crrDate[1])) {
    crrDate[1] = parseInt(crrDate[1]) + 12;
    crrDate[2]--;
    console.log(crrDate);
    console.log(new Date(crrDate[2], crrDate[1]));
  }

  dy = crrDate[0] - dayInputBox.value;
  mth = crrDate[1] - monthInputBox.value;
  yr = crrDate[2] - yearInputBox.value;

  yearComment[0].innerText = yr;
  dayComment[0].innerText = dy;
  monthComment[0].innerText = mth;
};

yearInputBox.addEventListener("input", (e) => {
  let val = e.target.value;
  if (val.length > 4) {
    e.target.value = lastYearValue;
  } else {
    lastYearValue = val;
  }
  udpateLastValue();
  calculateAge();
});

monthInputBox.addEventListener("input", (e) => {
  let val = e.target.value;
  let len = val.length;
  if (len > 2 || parseInt(val) < 1 || parseInt(val) > 12) {
    e.target.value = lastMonthValue;
  } else {
    lastMonthValue = val;
  }
  udpateLastValue();
  calculateAge();
});

dayInputBox.addEventListener("input", (e) => {
  let val = e.target.value;
  let len = val.length;
  if (len > 2 || parseInt(val) < 1 || parseInt(val) > lastDayValue) {
    e.target.value = lastDayValue;
  }
  calculateAge();
});
calculateAge();
