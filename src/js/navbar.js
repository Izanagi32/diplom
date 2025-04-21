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
      ctaClone.style.marginTop = '20px';
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
      spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
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
    const menuItems = document.querySelectorAll('.navbar__menu-link, .navbar__mobile-menu a');
    
    menuItems.forEach(item => {
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
  
  // Встановлюємо активний пункт меню при завантаженні сторінки
  setActiveMenuItem();
  
  // Адаптивна навігація - зміна при прокрутці
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const logo = document.querySelector('.navbar__logo');
    
    if (window.scrollY > 100) {
      navbar.style.padding = '0';
      navbar.style.backgroundColor = 'rgba(59, 59, 59, 0.95)';
      
      // Змінюємо стиль логотипу при прокрутці
      if (logo) {
        logo.classList.add('navbar__logo--scrolled');
      }
    } else {
      navbar.style.padding = '';
      navbar.style.backgroundColor = '#3b3b3b';
      
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
      
      // Додаємо м'яке світіння
      const glow = document.createElement('div');
      glow.className = 'logo-glow';
      glow.style.position = 'absolute';
      glow.style.top = '50%';
      glow.style.left = '50%';
      glow.style.transform = 'translate(-50%, -50%)';
      glow.style.width = '160%';
      glow.style.height = '160%';
      glow.style.borderRadius = '50%';
      glow.style.background = 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)';
      glow.style.zIndex = '-1';
      glow.style.opacity = '0';
      glow.style.transition = 'opacity 0.5s ease';
      
      this.appendChild(glow);
      
      // Затримка для анімації
      setTimeout(() => {
        glow.style.opacity = '1';
      }, 50);
    });
    
    logo.addEventListener('mouseleave', function() {
      this.style.transform = '';
      
      // Видаляємо ефект світіння
      const glow = this.querySelector('.logo-glow');
      if (glow) {
        glow.style.opacity = '0';
        setTimeout(() => {
          if (glow.parentNode === this) {
            this.removeChild(glow);
          }
        }, 400);
      }
    });
    
    // Додаємо тривимірний ефект обертання при русі миші
    logo.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left; // X позиція курсора відносно елемента
      const y = e.clientY - rect.top; // Y позиція курсора відносно елемента
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / centerX * 15; // -15..15 градусів
      const moveY = (y - centerY) / centerY * 10; // -10..10 градусів
      
      // Застосовуємо 3D ефект
      this.style.transform = `scale(1.05) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
      
      // Ефект паралаксу для псевдоелементів
      const shineEffect = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent 80px)`;
      this.style.backgroundImage = shineEffect;
    });
    
    // Повертаємо до початкового стану при виході миші
    logo.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.backgroundImage = '';
    });
    
    // Додаємо стилі для анімації
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes logoPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    
    // Додаємо пульсуючу анімацію після завантаження сторінки
    if (document.readyState === 'complete') {
      setTimeout(() => {
        logo.style.animation = 'logoPulse 1.5s ease';
        
        // Видаляємо анімацію після виконання
        setTimeout(() => {
          logo.style.animation = '';
        }, 1500);
      }, 500);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          logo.style.animation = 'logoPulse 1.5s ease';
          
          // Видаляємо анімацію після виконання
          setTimeout(() => {
            logo.style.animation = '';
          }, 1500);
        }, 500);
      });
    }
  }
}); 