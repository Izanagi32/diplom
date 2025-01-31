const steps = document.querySelectorAll('.process__step');

steps.forEach((step) => {
  // При кліку на будь-який крок
  step.addEventListener('click', () => {
    // Спочатку робимо всі кроки неактивними
    steps.forEach(s => {
      s.classList.remove('process__step--active');
      s.classList.add('process__step--inactive');
    });
    
    // А для кроку, по якому клікнули, робимо --active
    step.classList.remove('process__step--inactive');
    step.classList.add('process__step--active');
  });
});