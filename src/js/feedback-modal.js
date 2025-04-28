// src/js/feedback-modal.js
// Logic for opening, closing and validating the feedback modal on the Home page

document.addEventListener('DOMContentLoaded', () => {
  class FeedbackModal {
    constructor() {
      this.modal = document.getElementById('feedbackModal');
      this.successModal = document.getElementById('successModal');
      this.form = document.getElementById('feedbackForm');
      this.closeBtn = document.getElementById('modalClose');
      this.submitBtn = document.getElementById('submitFeedback');
      this.nameInput = document.getElementById('userName');
      this.feedbackInput = document.getElementById('userFeedback');
      this.charCounter = document.getElementById('charCounter');
      this.companyInput = document.getElementById('companyName');
      this.ratingInputs = document.getElementsByName('rating');
      this.triggerBtn = document.querySelector('.testimonials-section__button');
      this.init();
    }

    init() {
      this.triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
      this.closeBtn.addEventListener('click', () => this.closeModal());
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      this.nameInput.addEventListener('input', () => this.validateForm());
      this.feedbackInput.addEventListener('input', () => {
        this.validateForm();
        const length = this.feedbackInput.value.length;
        this.charCounter.textContent = `${length}/300`;
      });
      this.companyInput.addEventListener('input', () => this.validateForm());
      Array.from(this.ratingInputs).forEach(radio =>
        radio.addEventListener('change', () => this.validateForm())
      );
    }

    openModal() {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    closeModal() {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
      this.form.reset();
      this.charCounter.textContent = '0/300';
      this.validateForm();
    }

    validateForm() {
      const nameValid = this.nameInput.value.trim() !== '';
      const feedbackValid = this.feedbackInput.value.trim() !== '';
      const companyValid = this.companyInput.value.trim() !== '';
      const ratingValid = Array.from(this.ratingInputs).some(input => input.checked);
      this.submitBtn.disabled = !(nameValid && feedbackValid && companyValid && ratingValid);
    }

    handleSubmit(e) {
      e.preventDefault();
      const formData = {
        companyName: this.companyInput.value.trim(),
        rating: Array.from(this.ratingInputs).find(input => input.checked).value,
        name: this.nameInput.value.trim(),
        feedback: this.feedbackInput.value.trim()
      };
      console.log('Feedback submitted:', formData);
      this.closeModal();
      this.showSuccessMessage();
    }

    showSuccessMessage() {
      this.successModal.classList.add('active');
      setTimeout(() => {
        this.successModal.classList.remove('active');
      }, 3000);
    }
  }

  new FeedbackModal();
}); 