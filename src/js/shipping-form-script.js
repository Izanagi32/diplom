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
      // Відправка на FormBold
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        modal?.classList.add("modal--active");
        form.reset();
        document.getElementById("volume").textContent = "0";

        // 🔔 Відправка в Telegram
        await fetch(
          `https://api.telegram.org/bot7378979804:AAFLXNQ5mZJMjPM_XhHfNa8tm2mrbyaRyCQ/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: "1693054209",
              text: `
🚛 <b>Нова заявка з форми</b>

📍 <b>Звідки:</b> ${payload["pickup-location"]}
📍 <b>Куди:</b> ${payload["delivery-location"]}

📐 <b>Габарити:</b> ${payload["length"]} x ${payload["width"]} x ${
                payload["height"]
              } м
📦 <b>Кількість:</b> ${payload["quantity"]}
⚖️ <b>Вага:</b> ${payload["weight"]} кг
📂 <b>Тип вантажу:</b> ${payload["cargo-type"]}

💬 <b>Коментар:</b> ${payload["comment"] || "немає"}
📧 <b>Email:</b> ${payload["email"]}
            `,
              parse_mode: "HTML",
            }),
          }
        );
      } else {
        alert("❌ Помилка при надсиланні!");
      }
    } catch (error) {
      console.error("❌ Фатальна помилка:", error);
      alert("❌ Щось пішло не так. Спробуйте пізніше.");
    }
  });

  closeModalBtn?.addEventListener("click", () => {
    modal?.classList.remove("modal--active");
  });
});
