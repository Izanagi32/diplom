document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("quoteForm");

  if (!form) return;

  // ✅ Ініціалізація EmailJS
  emailjs.init("Kn7auEea2CjVBdYLj");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // 🔍 Додатково лог для перевірки (можеш прибрати після тесту)
    const formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    emailjs
      .sendForm("service_e5fernw", "template_82r496h", form)
      .then(() => {
        alert("✅ Заявку надіслано успішно!");
        form.reset();
      })
      .catch((error) => {
        alert("❌ Сталася помилка при надсиланні.");
        console.error("EmailJS error:", error);
      });
  });
});
