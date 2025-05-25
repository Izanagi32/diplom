document.querySelectorAll(".faq__question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;

    document.querySelectorAll(".faq__item").forEach((el) => {
      if (el !== item) {
        el.classList.remove("faq__item--active");
      }
    });

    item.classList.toggle("faq__item--active");
  });
});
