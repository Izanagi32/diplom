const buttons = document.querySelectorAll(".tabs__button");
const panels = document.querySelectorAll(".tabs__panel");
const tabOrder = Array.from(buttons).map((btn) => btn.dataset.tab);
const currentStepEl = document.getElementById("currentStep");

// Функція для оновлення активного табу
function activateTab(index) {
  const tabName = tabOrder[index];

  // Зняти активні класи
  buttons.forEach((btn) => btn.classList.remove("tabs__button--active"));
  panels.forEach((panel) => panel.classList.remove("tabs__panel--active"));

  // Додати активні класи
  const newActiveBtn = document.querySelector(
    `.tabs__button[data-tab="${tabName}"]`
  );
  const newActivePanel = document.getElementById(`tab-${tabName}`);

  if (newActiveBtn && newActivePanel) {
    newActiveBtn.classList.add("tabs__button--active");
    newActivePanel.classList.add("tabs__panel--active");
    currentStepEl.textContent = index + 1;
  }
}

// Ініціалізація
buttons.forEach((button, i) => {
  button.addEventListener("click", () => activateTab(i));
});

// Кнопка “Наступний крок”
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("tabs__next")) {
    const activeBtn = document.querySelector(".tabs__button--active");
    const currentIndex = tabOrder.indexOf(activeBtn.dataset.tab);
    const nextIndex = currentIndex + 1;

    if (tabOrder[nextIndex]) {
      activateTab(nextIndex);
    }
  }
});
