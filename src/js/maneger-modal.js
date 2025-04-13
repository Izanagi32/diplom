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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();
  const contactMethod = form.contact.value;

  const fullMessage = `Заявка з сайту:
Ім’я: ${name}
Телефон Viber: ${phone}
Спосіб зв’язку: ${contactMethod}
Коментар: ${message}`;

  // заміни USERNAME на свого Telegram-бота або користувача, якщо використовуєш сервіс типу t.me/share/url
  const tgUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(
    fullMessage
  )}`;
  window.open(tgUrl, "_blank");

  form.style.display = "none";
  thankYouBlock.style.display = "block";
});
