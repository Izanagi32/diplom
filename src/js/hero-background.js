document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const images = [
    './src/img/hero-photo.jpg',
    './src/img/daf-auto1.jpg',
    './src/img/daf-auto2.jpg',
    './src/img/daf-auto3.jpg'
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

  const content = hero.querySelector('.hero__wrap');
  if (content) content.classList.add('hero__content');

  slides.addEventListener('transitionend', () => {
    if (index === imagesCount) {
      slides.style.transition = 'none';
      slides.style.transform = 'translateX(0)';
      index = 0;
      slides.offsetHeight;
      slides.style.transition = 'transform 1s ease';
    }
  });
  setInterval(() => {
    index++;
    slides.style.transform = `translateX(-${index * 100}%)`;
  }, 6000);
}); 