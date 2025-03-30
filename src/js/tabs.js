// Оновлений JS для табів з кнопкою "Наступний крок"
const buttons = document.querySelectorAll(".tabs__button");
const panels = document.querySelectorAll(".tabs__panel");
const tabOrder = Array.from(buttons).map((btn) => btn.dataset.tab);

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabName = button.dataset.tab;

    // Зняти активні класи
    buttons.forEach((btn) => btn.classList.remove("tabs__button--active"));
    panels.forEach((panel) => panel.classList.remove("tabs__panel--active"));

    // Активувати вибраний таб і панель
    button.classList.add("tabs__button--active");
    document
      .getElementById(`tab-${tabName}`)
      .classList.add("tabs__panel--active");
  });
});

// Опціонально: кнопка "Наступний крок"
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("tabs__next")) {
    const activeBtn = document.querySelector(".tabs__button--active");
    const currentIndex = tabOrder.indexOf(activeBtn.dataset.tab);
    const nextIndex = currentIndex + 1;

    if (tabOrder[nextIndex]) {
      document
        .querySelector(`.tabs__button[data-tab="${tabOrder[nextIndex]}"]`)
        .click();
    }
  }
});
