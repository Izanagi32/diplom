// Функціонал мобільного меню для навігаційної панелі
document.addEventListener('DOMContentLoaded', function() {
  // Створюємо мобільну кнопку і меню, якщо вони не існують
  const navbar = document.querySelector('.navbar__block-menu');
  
  // Перевіряємо, чи вже існує мобільне меню
  if (!document.querySelector('.navbar__mobile-toggle')) {
    // Створюємо кнопку мобільного меню
    const mobileToggle = document.createElement('div');
    mobileToggle.className = 'navbar__mobile-toggle';
    mobileToggle.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    // Додаємо кнопку до нижньої частини навігації
    document.querySelector('.navbar__bottom').appendChild(mobileToggle);
    
    // Створюємо мобільне меню
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'navbar__mobile-menu';
    
    // Клонуємо існуючу навігацію для мобільного меню
    const menuClone = document.querySelector('.navbar__menu-list').cloneNode(true);
    mobileMenu.appendChild(menuClone);
    
    // Додаємо кнопку зв'язку до мобільного меню
    const ctaButton = document.querySelector('.navbar__cta-button');
    if (ctaButton) {
      const ctaClone = ctaButton.cloneNode(true);
      ctaClone.style.display = 'inline-block';
      mobileMenu.appendChild(ctaClone);
    }
    
    // Додаємо мобільне меню до body
    document.body.appendChild(mobileMenu);
  }
  
  // Отримуємо елементи для керування
  const mobileToggle = document.querySelector('.navbar__mobile-toggle');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');
  const body = document.body;
  
  // Функція для анімації кнопки бургер-меню
  function toggleBurgerAnimation() {
    const spans = mobileToggle.querySelectorAll('span');
    
    if (mobileMenu.classList.contains('active')) {
      // Анімація "X"
      spans[0].style.transform = 'rotate(45deg) translateY(8px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
      // Повернення до стандартного вигляду
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }
  
  // Відкриття/закриття мобільного меню при кліку на кнопку
  mobileToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    body.classList.toggle('no-scroll');
    toggleBurgerAnimation();
  });
  
  // Закриття мобільного меню при кліку за його межами
  document.addEventListener('click', function(event) {
    if (!mobileMenu.contains(event.target) && 
        !mobileToggle.contains(event.target) && 
        mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      body.classList.remove('no-scroll');
      toggleBurgerAnimation();
    }
  });
  
  // Закриття мобільного меню при натисканні на пункт меню
  const mobileMenuItems = mobileMenu.querySelectorAll('a');
  mobileMenuItems.forEach(item => {
    item.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      body.classList.remove('no-scroll');
      toggleBurgerAnimation();
    });
  });
  
  // Функція для додавання активного класу до поточного пункту меню
  function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.navbar__menu-link');
    const mobileMenuItems = document.querySelectorAll('.navbar__mobile-menu .navbar__menu-link');
    
    function checkAndSetActive(items) {
      items.forEach(item => {
        // Видаляємо активний клас з усіх елементів
        item.classList.remove('navbar__menu-link--active');
        
        // Порівнюємо шлях з href елемента
        const itemPath = item.getAttribute('href');
        if (itemPath) {
          const itemPathBase = itemPath.split('/').pop();
          const currentPathBase = currentPath.split('/').pop() || 'index.html';
          
          if (itemPathBase === currentPathBase ||
              (currentPathBase === 'index.html' && itemPathBase === './index.html') ||
              (currentPathBase === '' && itemPathBase === './index.html')) {
            item.classList.add('navbar__menu-link--active');
          }
        }
      });
    }
    
    checkAndSetActive(menuItems);
    checkAndSetActive(mobileMenuItems);
  }
  
  // Встановлюємо активний пункт меню при завантаженні сторінки
  setActiveMenuItem();
  
  // Адаптивна навігація - зміна при прокрутці
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const logo = document.querySelector('.navbar__logo');
    
    if (window.scrollY > 100) {
      navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
      
      // Змінюємо стиль логотипу при прокрутці
      if (logo) {
        logo.classList.add('navbar__logo--scrolled');
      }
    } else {
      navbar.style.backgroundColor = '';
      navbar.style.backdropFilter = '';
      
      // Повертаємо оригінальний стиль
      if (logo) {
        logo.classList.remove('navbar__logo--scrolled');
      }
    }
  });
  
  // Додаємо плавну анімацію для логотипу при наведенні
  const logo = document.querySelector('.navbar__logo');
  if (logo) {
    // Додаємо ефект світіння при наведенні
    logo.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05) translateY(-5px) rotateY(10deg)';
    });
    
    logo.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
    
    // Додаємо тривимірний ефект обертання при русі миші
    logo.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left; // X позиція курсора відносно елемента
      const y = e.clientY - rect.top; // Y позиція курсора відносно елемента
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / centerX * 10; // -10..10 градусів
      const moveY = (y - centerY) / centerY * 7; // -7..7 градусів
      
      // Застосовуємо 3D ефект
      this.style.transform = `scale(1.05) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
    });
  }
}); 