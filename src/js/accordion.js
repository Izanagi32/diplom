const accordionItems = document.querySelectorAll(".accordion__item");

accordionItems.forEach((item) => {
  const header = item.querySelector(".accordion__header");
  const content = item.querySelector(".accordion__content");
  const icon = header.querySelector("i");

  if (!header || !content || !icon) return; // Skip if elements not found

  header.addEventListener("click", () => {
    toggleItem(item);
  });

  header.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleItem(item);
    }
  });

  // Initialize: Set active item's max-height on load
  if (item.classList.contains("accordion__item--active")) {
    content.style.maxHeight = content.scrollHeight + "px";
  }
});

function toggleItem(itemToToggle) {
  const content = itemToToggle.querySelector(".accordion__content");
  const icon = itemToToggle.querySelector(".accordion__header i");
  const isActive = itemToToggle.classList.contains("accordion__item--active");

  // Close all items first
  accordionItems.forEach((item) => {
    if (item !== itemToToggle) { // Don't close the item we might open
      item.classList.remove("accordion__item--active");
      item.querySelector(".accordion__header i").className = "ti ti-plus";
      item.querySelector(".accordion__content").style.maxHeight = null; // Use null to reset to CSS
    }
  });

  // Toggle the clicked item
  if (isActive) {
    // Close it
    itemToToggle.classList.remove("accordion__item--active");
    icon.className = "ti ti-plus";
    content.style.maxHeight = null; // Use null to reset to CSS
  } else {
    // Open it
    itemToToggle.classList.add("accordion__item--active");
    icon.className = "ti ti-minus";
    // Set max-height to scrollHeight for smooth animation
    content.style.maxHeight = content.scrollHeight + "px";
  }
}
