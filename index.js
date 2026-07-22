const filterButtons = document.querySelectorAll(".filter-btn");
const groups = document.querySelectorAll(".group[data-group]");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    filterButtons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active);
    });

    groups.forEach((group) => {
      group.classList.toggle(
        "hidden",
        filter !== "all" && group.dataset.group !== filter
      );
    });
  });
});
