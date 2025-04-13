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
            email: "romancls94@gmail.com", // 🔁 Твій email
            subject: "🚛 Нова заявка з форми доставки",
            fields: payload,
          }),
        }
      );

      const responseText = await response.text();
      console.log("✅ Status:", response.status);
      console.log("📨 Response text:", responseText);

      if (response.ok) {
        modal?.classList.add("modal--active");
        form.reset();
        document.getElementById("volume").textContent = "0";
      } else {
        alert("❌ Помилка при надсиланні!\n" + responseText);
      }
    } catch (error) {
      console.error("❌ Виникла фатальна помилка:", error);
      alert("❌ Виникла фатальна помилка. Спробуйте пізніше.");
    }
  });

  closeModalBtn?.addEventListener("click", () => {
    modal?.classList.remove("modal--active");
  });
});
