document.addEventListener("DOMContentLoaded", () => {
  const botToken = "7378979804:AAGuviiwgUsrUprTP_NBm_wZn8iSH8l4a5U";
  const chatId = "1693054209";

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

  const form1 = document.getElementById("quoteForm");
  const modal1 = document.getElementById("formModal");
  const closeModalBtn = document.getElementById("closeModal");

  const lengthInput = document.getElementById('length');
  const widthInput = document.getElementById('width');
  const heightInput = document.getElementById('height');
  const quantityInput = document.getElementById('quantity');
  const volumeOutput = document.getElementById('volume');
  function updateVolume() {
    const l = parseFloat(lengthInput.value) || 0;
    const w = parseFloat(widthInput.value) || 0;
    const h = parseFloat(heightInput.value) || 0;
    const q = parseInt(quantityInput.value) || 0;
    const vol = (l * w * h * q) || 0;
    volumeOutput.textContent = parseFloat(vol.toFixed(2));
  }
  [lengthInput, widthInput, heightInput, quantityInput].forEach(el =>
    el.addEventListener('input', updateVolume)
  );
  updateVolume();

  const adrCheckbox = document.getElementById('adr');
  const adrSelect = document.getElementById('adr-class');
  adrCheckbox.addEventListener('change', () => {
    adrSelect.hidden = !adrCheckbox.checked;
    adrSelect.disabled = !adrCheckbox.checked;
  });

  form1?.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Static pickup and delivery locations
    const pickup = document.getElementById('pickup-location').value.trim();
    const delivery = document.getElementById('delivery-location').value.trim();
    // Add basic validation
    if (!pickup || !delivery) {
      alert('Будь ласка, заповніть поля Звідки та Куди.');
      return;
    }

    const l = parseFloat(lengthInput.value) || 0;
    const w = parseFloat(widthInput.value) || 0;
    const h = parseFloat(heightInput.value) || 0;
    const q = parseInt(quantityInput.value) || 0;
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const volume = (l * w * h * q).toFixed(2);

    const date = document.getElementById('pickup-date').value;

    const cargoType = document.getElementById('cargo-type').value.trim();
    if (!cargoType) {
      alert('Будь ласка, введіть тип вантажу.');
      return;
    }
    const isAdr = adrCheckbox.checked;
    const adrClassVal = adrSelect.value;

    const comment = document.getElementById('comment').value.trim() || 'немає';
    const contactName = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    const attachmentInput = document.getElementById('attachment');
    const fileName = attachmentInput.files.length > 0 ? attachmentInput.files[0].name : 'немає';

    let message = `🚛 <b>Нова заявка з форми</b>\n\n📍 <b>Звідки:</b> ${pickup}\n📍 <b>Куди:</b> ${delivery}\n\n`;
    message += `🗓️ <b>Дата подачі:</b> ${date}\n`;
    message += `\n📐 <b>Габарити:</b> ${l} x ${w} x ${h} м\n📦 <b>Кількість:</b> ${q}\n⚖️ <b>Вага:</b> ${weight} кг\n`;
    message += `\n<b>Об'єм:</b> ${volume} м³\n📂 <b>Тип вантажу:</b> ${cargoType}`;
    if (isAdr) message += `\n🚨 <b>ADR вантаж. Клас ADR:</b> ${adrClassVal}`;
    message += `\n\n💬 <b>Коментар:</b> ${comment}`;
    message += `\n\n📞 <b>Контакт:</b> ${contactName}, ${phone}\n📧 <b>Email:</b> ${email}`;
    message += `\n📎 <b>Файл:</b> ${fileName}`;

    const success = await sendToTelegram(message);
    if (success) {
      modal1?.classList.add("modal--active");
      form1.reset();
      volumeOutput.textContent = '0';
      adrSelect.hidden = true;
      adrSelect.disabled = true;
    } else {
      alert("❌ Повідомлення не відправлено.");
    }
  });

  closeModalBtn?.addEventListener("click", () => {
    modal1?.classList.remove("modal--active");
  });

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
        
        const formElement = this.parentNode;
        const successMessage = document.createElement('div');
        successMessage.className = 'site-footer__subscribe-success';
        successMessage.textContent = 'Дякуємо за підписку!';
        successMessage.style.color = '#3a97e8';
        successMessage.style.fontSize = '14px';
        successMessage.style.marginTop = '8px';
        formElement.appendChild(successMessage);
        
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
