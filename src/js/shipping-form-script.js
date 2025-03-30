const form = document.querySelector(".shipping-form");
const modal = document.getElementById("formModal");
const closeModalBtn = document.getElementById("closeModal");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // зупиняємо стандартну дію

  // Тут можна зробити валідацію / відправку

  modal.classList.add("modal--active");

  // Очистити форму
  form.reset();
  document.getElementById("volume").textContent = "0";
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("modal--active");
});
