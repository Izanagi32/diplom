const buttons = document.querySelectorAll(".tabs__button");
const panels = document.querySelectorAll(".tabs__panel");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabName = button.dataset.tab;

    // Деактивувати всі кнопки
    buttons.forEach((btn) => btn.classList.remove("tabs__button--active"));

    // Деактивувати всі панелі
    panels.forEach((panel) => panel.classList.remove("tabs__panel--active"));

    // Активувати вибрану кнопку
    button.classList.add("tabs__button--active");

    // Активувати відповідну панель
    document
      .getElementById(`tab-${tabName}`)
      .classList.add("tabs__panel--active");
  });
});
