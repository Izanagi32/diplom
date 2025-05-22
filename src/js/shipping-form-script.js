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
  if (lengthInput && widthInput && heightInput && quantityInput && volumeOutput) {
    [lengthInput, widthInput, heightInput, quantityInput].forEach(el =>
      el.addEventListener('input', updateVolume)
    );
    updateVolume();
  }

  const adrCheckbox = document.getElementById('adr');
  const adrSelect = document.getElementById('adr-class');
  if (adrCheckbox && adrSelect) {
    adrCheckbox.addEventListener('change', () => {
      adrSelect.hidden = !adrCheckbox.checked;
      adrSelect.disabled = !adrCheckbox.checked;
    });
  }

  form1?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pickup = document.getElementById('pickup-location').value.trim();
    const delivery = document.getElementById('delivery-location').value.trim();
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

    const formData = {
      pickupLocation: pickup,
      deliveryLocation: delivery,
      length: l,
      width: w,
      height: h,
      weight,
      quantity: q,
      cargoType,
      adr: isAdr,
      adrClass: adrClassVal,
      comment,
      pickupDate: date,
      contactName,
      phone,
      email
    };
    console.log('sending form', formData);
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Request failed:', response.status, errorText);
        alert('Не вдалося відправити заявку.');
        return;
      }
      modal1?.classList.add("modal--active");
      form1.reset();
      volumeOutput.textContent = '0';
      adrSelect.hidden = true;
      adrSelect.disabled = true;
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Не вдалося відправити заявку.');
    }
  });

  closeModalBtn?.addEventListener("click", () => {
    modal1?.classList.remove("modal--active");
  });

  const modal2 = document.getElementById("contactModal");
  const navbarContactBtn = document.querySelector(".navbar__cta-button");
  const faqCtaBtn = document.querySelector(".faq__cta-button");
  const heroButton = document.querySelector(".hero__button-second");
  const closeBtn = document.querySelector(".submitModal__close");
  const form2 = document.getElementById("contactForm");
  const thankYouBlock = document.querySelector(".submitModal__thankyou");
  
  function createTopicSelect() {
    if (!form2) return;
    
    const topicGroup = document.createElement('div');
    topicGroup.className = 'submitModal__group';
    
    const topicLabel = document.createElement('label');
    topicLabel.setAttribute('for', 'topic');
    topicLabel.className = 'submitModal__label';
    topicLabel.textContent = 'Тема звернення';
    
    const topicSelect = document.createElement('select');
    topicSelect.id = 'topic';
    topicSelect.name = 'topic';
    topicSelect.className = 'submitModal__select';
    topicSelect.required = true;
    
    const topics = [
      { value: 'general', text: 'Загальне питання' },
      { value: 'delivery', text: 'Доставка вантажу' },
      { value: 'tracking', text: 'Відстеження замовлення' },
      { value: 'pricing', text: 'Ціни та оплата' },
      { value: 'feedback', text: 'Залишити відгук' },
      { value: 'complaint', text: 'Скарга' },
      { value: 'partnership', text: 'Співпраця' }
    ];
    
    topics.forEach(topic => {
      const option = document.createElement('option');
      option.value = topic.value;
      option.textContent = topic.text;
      topicSelect.appendChild(option);
    });
    
    topicGroup.appendChild(topicLabel);
    topicGroup.appendChild(topicSelect);
    
    const firstGroup = form2.querySelector('.submitModal__group');
    firstGroup.parentNode.insertBefore(topicGroup, firstGroup.nextSibling);
    
    return topicSelect;
  }
  
  function createFileUpload() {
    if (!form2) return;
    
    const fileGroup = document.createElement('div');
    fileGroup.className = 'submitModal__group';
    
    const fileLabel = document.createElement('label');
    fileLabel.setAttribute('for', 'attachment');
    fileLabel.className = 'submitModal__label';
    fileLabel.textContent = 'Додати файл (необов\'язково)';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'attachment';
    fileInput.name = 'attachment';
    fileInput.className = 'submitModal__file';
    fileInput.accept = '.jpg,.jpeg,.png,.pdf,.doc,.docx';
    
    const filePreview = document.createElement('div');
    filePreview.className = 'submitModal__file-preview';
    
    fileGroup.appendChild(fileLabel);
    fileGroup.appendChild(fileInput);
    fileGroup.appendChild(filePreview);
    
    const submitBtn = form2.querySelector('button[type="submit"]');
    submitBtn.parentNode.insertBefore(fileGroup, submitBtn);
    
    fileInput.addEventListener('change', () => {
      filePreview.innerHTML = '';
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        
        if (file.size > 5 * 1024 * 1024) {
          showToast('Файл повинен бути менше 5MB', 'error');
          fileInput.value = '';
          return;
        }
        
        const fileName = document.createElement('div');
        fileName.className = 'submitModal__file-name';
        fileName.innerHTML = `<span>${file.name}</span> <button type="button" class="submitModal__file-remove">×</button>`;
        
        fileName.querySelector('.submitModal__file-remove').addEventListener('click', () => {
          fileInput.value = '';
          filePreview.innerHTML = '';
        });
        
        filePreview.appendChild(fileName);
      }
    });
    
    return fileInput;
  }
  
  function openModal() {
    modal2.style.display = "flex";
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      modal2.classList.add("visible");
    }, 10);
    
    restoreFormData();
  }
  
  function closeModal() {
    modal2.classList.remove("visible");
    setTimeout(() => {
      modal2.style.display = "none";
      document.body.style.overflow = "auto";
    }, 300);
    
    saveFormData();
  }
  
  function saveFormData() {
    if (!form2) return;
    
    const formData = {
      name: form2.name.value,
      phone: form2.phone.value,
      contact: form2.contact.value,
      message: form2.message.value
    };
    
    if (form2.topic) {
      formData.topic = form2.topic.value;
    }
    
    localStorage.setItem('contactFormData', JSON.stringify(formData));
  }
  
  function restoreFormData() {
    if (!form2) return;
    
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
      try {
        const formData = JSON.parse(savedData);
        form2.name.value = formData.name || '';
        form2.phone.value = formData.phone || '';
        form2.contact.value = formData.contact || 'phone';
        form2.message.value = formData.message || '';
        
        if (form2.topic && formData.topic) {
          form2.topic.value = formData.topic;
        }
      } catch (e) {
        console.error('Error restoring form data:', e);
      }
    }
  }

  function formatPhoneNumber(phoneInput) {
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 0) {
        if (value.length <= 3) {
          value = '+' + value;
        } else if (value.length <= 5) {
          value = '+' + value.substring(0, 3) + ' ' + value.substring(3);
        } else if (value.length <= 8) {
          value = '+' + value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5);
        } else if (value.length <= 10) {
          value = '+' + value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5, 8) + ' ' + value.substring(8);
        } else {
          value = '+' + value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5, 8) + ' ' + value.substring(8, 10) + ' ' + value.substring(10, 12);
        }
      }
      
      e.target.value = value;
    });
  }
  
  function setupFormValidation(form) {
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        highlightInvalidField(input);
      });
      
      input.addEventListener('focus', () => {
        removeInvalidHighlight(input);
      });
      
      input.addEventListener('blur', () => {
        if (input.required && !input.value) {
          highlightInvalidField(input);
        } else {
          validateInput(input);
        }
      });
    });
    
    form.addEventListener('submit', (e) => {
      let isValid = true;
      
      inputs.forEach(input => {
        if (input.required && !input.value) {
          e.preventDefault();
          highlightInvalidField(input);
          isValid = false;
        } else if (!validateInput(input)) {
          e.preventDefault();
          isValid = false;
        }
      });
      
      return isValid;
    });
  }
  
  function validateInput(input) {
    if (!input.value) return true;
    
    if (input.id === 'phone') {
      const phonePattern = /^\+\d{3} \d{2} \d{3} \d{2} \d{2}$/;
      if (!phonePattern.test(input.value)) {
        highlightInvalidField(input, 'Введіть номер у форматі +380 XX XXX XX XX');
        return false;
      }
    }
    
    if (input.id === 'name') {
      if (input.value.length < 2) {
        highlightInvalidField(input, 'Ім\'я повинно містити мінімум 2 символи');
        return false;
      }
    }
    
    removeInvalidHighlight(input);
    return true;
  }
  
  function highlightInvalidField(input, message) {
    const group = input.closest('.submitModal__group');
    if (!group) return;
    
    group.classList.add('invalid');
    
    let errorMsg = group.querySelector('.submitModal__error');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'submitModal__error';
      group.appendChild(errorMsg);
    }
    
    if (message) {
      errorMsg.textContent = message;
    } else if (input.required) {
      errorMsg.textContent = 'Це поле обов\'язкове';
    } else {
      errorMsg.textContent = 'Невірне значення';
    }
    
    input.classList.add('shake');
    setTimeout(() => {
      input.classList.remove('shake');
    }, 500);
  }
  
  function removeInvalidHighlight(input) {
    const group = input.closest('.submitModal__group');
    if (!group) return;
    
    group.classList.remove('invalid');
    const errorMsg = group.querySelector('.submitModal__error');
    if (errorMsg) {
      errorMsg.remove();
    }
  }
  
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `submitModal__toast submitModal__toast--${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('submitModal__toast--visible');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('submitModal__toast--visible');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  const formInputs = form2?.querySelectorAll('input, textarea, select');
  formInputs?.forEach(input => {
    const formGroup = input.closest('.submitModal__group');
    
    input.addEventListener('focus', () => {
      formGroup.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      formGroup.classList.remove('focused');
    });
  });

  function initContactForm() {
    if (!form2) return;
    
    const topicSelect = createTopicSelect();
    const fileInput = createFileUpload();
    formatPhoneNumber(form2.querySelector('#phone'));
    setupFormValidation(form2);
    addFormStyles();
  }
  
  function addFormStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .submitModal__error {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
      }
      
      .submitModal__group.invalid .submitModal__input,
      .submitModal__group.invalid .submitModal__select,
      .submitModal__group.invalid .submitModal__textarea {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
      }
      
      .submitModal__file {
        font-size: 0.9rem;
        padding: 0.5rem;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px dashed #ccc;
        width: 100%;
        cursor: pointer;
      }
      
      .submitModal__file-preview {
        margin-top: 0.5rem;
      }
      
      .submitModal__file-name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0.75rem;
        background: rgba(0, 91, 187, 0.1);
        border-radius: 6px;
        font-size: 0.9rem;
      }
      
      .submitModal__file-remove {
        background: rgba(0, 0, 0, 0.1);
        border: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1rem;
        color: #555;
        padding: 0;
        transition: all 0.2s ease;
      }
      
      .submitModal__file-remove:hover {
        background: rgba(231, 76, 60, 0.2);
        color: #e74c3c;
      }
      
      .submitModal__toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 0.8rem 1.5rem;
        background: #323232;
        color: white;
        border-radius: 4px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      
      .submitModal__toast--visible {
        transform: translateY(0);
        opacity: 1;
      }
      
      .submitModal__toast--error {
        background: #e74c3c;
      }
      
      .submitModal__toast--success {
        background: #2ecc71;
      }
      
      .submitModal__toast--info {
        background: #3498db;
      }
      
      .shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
      }
      
      @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
        40%, 60% { transform: translate3d(3px, 0, 0); }
      }
      
      .loading-dots:after {
        content: '...';
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { content: '.'; }
        33% { content: '..'; }
        66% { content: '...'; }
      }
    `;
    document.head.appendChild(style);
  }

  navbarContactBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });
  
  faqCtaBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });
  
  heroButton?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn?.addEventListener("click", closeModal);

  modal2?.addEventListener("click", (e) => {
    if (e.target === modal2) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal2?.style.display === "flex") {
      closeModal();
    }
  });

  form2?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const submitBtn = form2.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-dots">Надсилання</span>';
    submitBtn.disabled = true;
    
    const name = form2.name.value.trim();
    const phone = form2.phone.value.trim();
    const contactMethod = form2.contact.value;
    const message = form2.message.value.trim();
    
    const topicValue = form2.topic ? form2.topic.value : 'Загальне питання';
    const fileInput = form2.querySelector('#attachment');
    const hasFile = fileInput && fileInput.files.length > 0;
    
    const fullMessage = 
      `📞 <b>Зв'язок з менеджером</b>\n\n` +
      `<b>Ім'я:</b> ${name}\n` +
      `<b>Телефон:</b> ${phone}\n` +
      `<b>Спосіб зв'язку:</b> ${contactMethod}\n` +
      `<b>Тема:</b> ${topicValue}\n` +
      (hasFile ? `<b>Файл:</b> ${fileInput.files[0].name}\n` : '') +
      `<b>Коментар:</b> ${message}`;
      
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ok = await sendToTelegram(fullMessage);

      if (ok) {
        form2.style.display = "none";
        thankYouBlock.style.display = "block";
        
        localStorage.removeItem('contactFormData');
        
        showToast('Повідомлення успішно надіслано!', 'success');
      } else {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        showToast('Не вдалося надіслати повідомлення. Спробуйте пізніше.', 'error');
      }
    } catch (error) {
      console.error("Error sending form:", error);
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      showToast('Сталася помилка. Спробуйте пізніше.', 'error');
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

  initContactForm();
});
