document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quoteForm");
  const modal = document.getElementById("formModal");
  const closeModalBtn = document.getElementById("closeModal");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {};

    formData.forEach((value, key) => {
      payload[key] = value;
    });

    try {
      const response = await fetch(
        "https://unstaticforms.vercel.app/api/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "romancls94@gmail.com",
            subject: "🚛 Нова заявка з форми доставки",
            fields: payload,
          }),
        }
      );

      if (response.ok) {
        modal?.classList.add("modal--active");
        form.reset();
        document.getElementById("volume").textContent = "0";
      } else {
        alert("❌ Помилка при надсиланні!");
      }
    } catch (error) {
      console.error("❌ Помилка:", error);
      alert("❌ Виникла помилка. Спробуйте пізніше.");
    }
  });

  closeModalBtn?.addEventListener("click", () => {
    modal?.classList.remove("modal--active");
  });
});
