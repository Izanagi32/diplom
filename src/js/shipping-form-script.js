const form = document.querySelector(".shipping-form");
const modal = document.getElementById("formModal");
const closeModalBtn = document.getElementById("closeModal");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      modal.classList.add("modal--active");
      form.reset();
      document.getElementById("volume").textContent = "0";
    } else {
      alert("❌ Помилка під час відправки форми.");
    }
  } catch (error) {
    console.error("Помилка при надсиланні:", error);
    alert("❌ Виникла помилка. Спробуйте пізніше.");
  }
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("modal--active");
});
