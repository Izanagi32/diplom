const modal = document.getElementById("contactModal");
const openBtn = document.getElementById("contactManagerBtn");
const closeBtn = document.querySelector(".submitModal__close");
const form = document.getElementById("contactForm");
const thankYouBlock = document.querySelector(".submitModal__thankyou");

openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
});

// Відправка повідомлення через Telegram Bot API
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();
  const contactMethod = form.contact.value;

  const fullMessage = `📥 Нова заявка з сайту:
Ім’я: ${name}
Телефон Viber: ${phone}
Спосіб зв’язку: ${contactMethod}
Коментар: ${message}`;

  const botToken = "7378979804:AAFLXNQ5mZJMjPM_XhFNa8tm2mrbyaRyCQ";
  const chatId = "1693054209";
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: fullMessage,
      }),
    });

    // Успішно — показуємо подяку
    form.style.display = "none";
    thankYouBlock.style.display = "block";
  } catch (error) {
    alert("Помилка відправлення. Спробуйте пізніше.");
    console.error("Telegram API error:", error);
  }
});
