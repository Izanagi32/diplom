const accordionItems = document.querySelectorAll(".accordion__item");

accordionItems.forEach((item) => {
  const header = item.querySelector(".accordion__header");
  const content = item.querySelector(".accordion__content");
  const icon = header.querySelector("i");

  if (!header || !content || !icon) return;

  header.addEventListener("click", () => {
    toggleItem(item);
  });

  header.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleItem(item);
    }
  });

  if (item.classList.contains("accordion__item--active")) {
    content.style.maxHeight = content.scrollHeight + "px";
  }
});

function toggleItem(itemToToggle) {
  const content = itemToToggle.querySelector(".accordion__content");
  const icon = itemToToggle.querySelector(".accordion__header i");
  const isActive = itemToToggle.classList.contains("accordion__item--active");

  accordionItems.forEach((item) => {
    if (item !== itemToToggle) {
      item.classList.remove("accordion__item--active");
      item.querySelector(".accordion__header i").className = "ti ti-plus";
      item.querySelector(".accordion__content").style.maxHeight = null;
    }
  });

  if (isActive) {
    itemToToggle.classList.remove("accordion__item--active");
    icon.className = "ti ti-plus";
    content.style.maxHeight = null;
  } else {
    itemToToggle.classList.add("accordion__item--active");
    icon.className = "ti ti-minus";
    content.style.maxHeight = content.scrollHeight + "px";
  }
}
