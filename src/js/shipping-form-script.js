document.addEventListener("DOMContentLoaded", () => {
  // === Налаштування ===
  const botToken = "7378979804:AAGuviiwgUsrUprTP_NBm_wZn8iSH8l4a5U";
  const chatId = "1693054209";

  // === Загальна функція відправки в Telegram ===
  async function sendToTelegram(messageText) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: "HTML",
        }),
      });

      const result = await response.json();
      console.log("📬 Telegram API:", result);
      return result.ok;
    } catch (error) {
      console.error("❗ Fetch error:", error);
      return false;
    }
  }

  // === Форма 1: shipping-form ===
  const form1 = document.getElementById("quoteForm");
  const modal1 = document.getElementById("formModal");
  const closeModalBtn = document.getElementById("closeModal");

  form1?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form1);
    const payload = {};
    formData.forEach((value, key) => {
      payload[key] = value;
    });

    const message = `🚛 <b>Нова заявка з форми</b>\n\n📍 <b>Звідки:</b> ${
      payload["pickup-location"]
    }\n📍 <b>Куди:</b> ${payload["delivery-location"]}\n\n📐 <b>Габарити:</b> ${
      payload["length"]
    } x ${payload["width"]} x ${payload["height"]} м\n📦 <b>Кількість:</b> ${
      payload["quantity"]
    }\n⚖️ <b>Вага:</b> ${payload["weight"]} кг\n📂 <b>Тип вантажу:</b> ${
      payload["cargo-type"]
    }\n\n💬 <b>Коментар:</b> ${
      payload["comment"] || "немає"
    }\n📧 <b>Email:</b> ${payload["email"]}`;

    const success = await sendToTelegram(message);

    if (success) {
      modal1?.classList.add("modal--active");
      form1.reset();
      document.getElementById("volume").textContent = "0";
    } else {
      alert("❌ Повідомлення не відправлено.");
    }
  });

  closeModalBtn?.addEventListener("click", () => {
    modal1?.classList.remove("modal--active");
  });

  // === Форма 2: contactForm (модалка з кнопки Зв'язатись з менеджером) ===
  const modal2 = document.getElementById("contactModal");
  const openBtn = document.getElementById("contactManagerBtn");
  const closeBtn = document.querySelector(".submitModal__close");
  const form2 = document.getElementById("contactForm");
  const thankYouBlock = document.querySelector(".submitModal__thankyou");

  openBtn?.addEventListener("click", () => {
    modal2.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  closeBtn?.addEventListener("click", () => {
    modal2.style.display = "none";
    document.body.style.overflow = "auto";
  });

  form2?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form2.name.value.trim();
    const phone = form2.phone.value.trim();
    const message = form2.message.value.trim();
    const contactMethod = form2.contact.value;

    const fullMessage = `📞 <b>Зв'язок з менеджером</b>\n\n<b>Ім'я:</b> ${name}\n<b>Телефон Viber:</b> ${phone}\n<b>Спосіб зв'язку:</b> ${contactMethod}\n<b>Коментар:</b> ${message}`;

    const ok = await sendToTelegram(fullMessage);

    if (ok) {
      form2.style.display = "none";
      thankYouBlock.style.display = "block";
    } else {
      alert("❌ Повідомлення не відправлено. Спробуйте пізніше.");
    }
  });

  // === Форма підписки на новини в футері ===
  const subscribeButtons = document.querySelectorAll('.site-footer__subscribe-button');
  
  subscribeButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const inputField = this.parentNode.querySelector('.site-footer__subscribe-input');
      const email = inputField.value.trim();
      
      if (!email) {
        alert('Будь ласка, введіть ваш email');
        return;
      }
      
      if (!validateEmail(email)) {
        alert('Будь ласка, введіть коректний email');
        return;
      }
      
      const message = `📧 <b>Новий підписник</b>\n\n<b>Email:</b> ${email}`;
      const success = await sendToTelegram(message);
      
      if (success) {
        inputField.value = '';
        
        // Відображаємо повідомлення про успіх
        const formElement = this.parentNode;
        const successMessage = document.createElement('div');
        successMessage.className = 'site-footer__subscribe-success';
        successMessage.textContent = 'Дякуємо за підписку!';
        successMessage.style.color = '#3a97e8';
        successMessage.style.fontSize = '14px';
        successMessage.style.marginTop = '8px';
        formElement.appendChild(successMessage);
        
        // Видаляємо повідомлення через 3 секунди
        setTimeout(() => {
          if (successMessage.parentNode === formElement) {
            formElement.removeChild(successMessage);
          }
        }, 3000);
      } else {
        alert('Не вдалося підписатися. Спробуйте пізніше.');
      }
    });
  });
  
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }
});
