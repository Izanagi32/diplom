document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const images = [
    './src/img/updatedphoto1_1.avif',
    './src/img/updatedphoto2_1.avif',
    './src/img/updatedphoto3.avif',
    './src/img/updatedphoto4.avif',
    './src/img/updatedphoto5.avif',
    './src/img/updatedphoto6.avif'
  ];
  let index = 0;

  const slides = document.createElement('div');
  slides.className = 'hero__slides';
  images.forEach(src => {
    const slide = document.createElement('div');
    slide.className = 'hero__slide';
    slide.style.backgroundImage = `url(${src})`;
    slides.appendChild(slide);
  });
  hero.insertBefore(slides, hero.firstChild);

  const imagesCount = images.length;
  const firstClone = slides.children[0].cloneNode(true);
  slides.appendChild(firstClone);
  const totalSlides = imagesCount + 1;
  slides.style.width = `${totalSlides * 100}%`;
  Array.from(slides.children).forEach(slide => {
    slide.style.width = `${100 / totalSlides}%`;
  });

  const content = hero.querySelector('.hero__wrap');
  if (content) content.classList.add('hero__content');

  slides.style.transition = 'transform 1s ease';
  slides.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;
    if (index === imagesCount) {
      slides.style.transition = 'none';
      slides.style.transform = 'translateX(0%)';
      index = 0;
      requestAnimationFrame(() => {
        slides.style.transition = 'transform 1s ease';
      });
    }
  });

  let intervalId;
  function updateCarousel() {
    const translatePercent = (100 / totalSlides) * index;
    slides.style.transform = `translateX(-${translatePercent}%)`;
    updateDots();
  }
  function startCarousel() {
    intervalId = setInterval(() => {
      index = (index + 1) % imagesCount;
      updateCarousel();
    }, 6000);
  }
  function pauseCarousel() {
    clearInterval(intervalId);
  }
  function resetCarousel() {
    pauseCarousel();
    startCarousel();
  }

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'hero__dots';
  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero__dot';
    dot.setAttribute('aria-label', `Перейти до слайду ${i + 1}`);
    dot.addEventListener('click', () => {
      index = i;
      updateCarousel();
      resetCarousel();
    });
    dotsContainer.appendChild(dot);
  });
  hero.appendChild(dotsContainer);

  function updateDots() {
    Array.from(dotsContainer.children).forEach((dot, i) => {
      dot.classList.toggle('hero__dot--active', i === index);
    });
  }

  hero.addEventListener('mouseenter', pauseCarousel);
  hero.addEventListener('mouseleave', startCarousel);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      updateCarousel();
    }
  });

  updateCarousel();
  startCarousel();
}); 