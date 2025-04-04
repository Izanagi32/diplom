document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("quoteForm");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

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
