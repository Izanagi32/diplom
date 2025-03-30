const accordionItems = document.querySelectorAll(".accordion__item");

accordionItems.forEach((item) => {
  const header = item.querySelector(".accordion__header");
  const content = item.querySelector(".accordion__content");

  header.addEventListener("click", () => {
    const isActive = item.classList.contains("accordion__item--active");

    // Закрити всі інші
    accordionItems.forEach((i) => {
      i.classList.remove("accordion__item--active");
      i.querySelector(".accordion__header i").className = "ti ti-plus";
      const c = i.querySelector(".accordion__content");
      if (c) c.style.maxHeight = null;
    });

    // Відкрити поточний, якщо не був активний
    if (!isActive) {
      item.classList.add("accordion__item--active");
      header.querySelector("i").className = "ti ti-minus";
      if (content) content.style.maxHeight = content.scrollHeight + "px";
    }
  });

  // Якщо активний при завантаженні – встановити висоту
  if (item.classList.contains("accordion__item--active") && content) {
    content.style.maxHeight = content.scrollHeight + "px";
  }
});
