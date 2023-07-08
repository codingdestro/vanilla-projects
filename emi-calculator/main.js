let [amount, rate, months] = document.querySelectorAll(" input");
let emi = 0;
let payable = 0;
let totalAmount = 0;

const calculateEmi = () => {
  let p = parseInt(amount.value);
  let r = rate.value;
  let n = months.value;
  if (!p || !r || !n) return;
  r = r / 12 / 100;
  emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  totalAmount = parseFloat(n * emi).toFixed(2);
  payable = parseFloat(totalAmount - p).toFixed(2);
  return [parseFloat(emi).toFixed(2), totalAmount, payable];
};

const getAmountToString = (amount) => {
  return parseFloat(amount).toLocaleString();
};

const showData = (emi, total, payable) => {
  document.querySelector(".emi.amount").innerText = getAmountToString(emi);
  document.querySelectorAll(".info-card .amount")[0].innerText = parseInt(
    amount.value
  ).toLocaleString();
  document.querySelectorAll(".info-card .amount")[1].innerText =
    getAmountToString(payable);
  document.querySelectorAll(".info-card .amount")[2].innerText =
    getAmountToString(total);
};

document.querySelector(".calc-btn").addEventListener("click", () => {
  emi = calculateEmi();
  if (!emi) return;
  showData(...emi);
});
