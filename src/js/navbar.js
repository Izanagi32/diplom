
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar__block-menu');
  
  if (!document.querySelector('.navbar__mobile-toggle')) {
    const mobileToggle = document.createElement('div');
    mobileToggle.className = 'navbar__mobile-toggle';
    mobileToggle.setAttribute('aria-label', 'Відкрити меню');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('role', 'button');
    mobileToggle.setAttribute('tabindex', '0');
    mobileToggle.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    document.querySelector('.navbar__bottom').appendChild(mobileToggle);
    
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'navbar__mobile-overlay';
    document.body.appendChild(overlay);
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'navbar__mobile-menu';
    
    // Додаємо кнопку-хрестик у mobileMenu
    const closeBtn = document.createElement('button');
    closeBtn.className = 'navbar__mobile-close';
    closeBtn.setAttribute('aria-label', 'Закрити меню');
    closeBtn.innerHTML = `
      <svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true" focusable="false" style="display:block;margin:auto;">
        <line x1="8" y1="8" x2="26" y2="26" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="26" y1="8" x2="8" y2="26" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `;
    mobileMenu.appendChild(closeBtn);
    
    const menuClone = document.querySelector('.navbar__menu-list').cloneNode(true);
    mobileMenu.appendChild(menuClone);
    
    const ctaButton = document.querySelector('.navbar__cta-button');
    if (ctaButton) {
      const ctaClone = ctaButton.cloneNode(true);
      ctaClone.style.display = 'inline-block';
      mobileMenu.appendChild(ctaClone);
    }
    
    // Додаємо лого у верхню частину меню
    const logoSrc = document.querySelector('.navbar__logo-image')?.src || 'src/img/Logo.avif';
    const logoWrap = document.createElement('div');
    logoWrap.className = 'navbar__mobile-logo';
    logoWrap.innerHTML = `<img src="${logoSrc}" alt="Логотип"/>`;
    mobileMenu.appendChild(logoWrap);
    // Додаємо підпис 'Меню'
    const menuTitle = document.createElement('div');
    menuTitle.className = 'navbar__mobile-title';
    menuTitle.textContent = 'Меню';
    mobileMenu.appendChild(menuTitle);
    
    document.body.appendChild(mobileMenu);
  }
  
  const mobileToggle = document.querySelector('.navbar__mobile-toggle');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');
  const overlay = document.querySelector('.navbar__mobile-overlay');
  const body = document.body;
  const closeBtn = document.querySelector('.navbar__mobile-close');
  
  function toggleBurgerAnimation() {
    mobileToggle.classList.toggle('active');
  }
  
  mobileToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    body.classList.toggle('no-scroll');
    mobileToggle.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
    // Приховуємо бургер-іконку, показуємо хрестик
    if (mobileMenu.classList.contains('active')) {
      mobileToggle.style.display = 'none';
      closeBtn.style.display = 'block';
      closeBtn.classList.add('active');
    } else {
      mobileToggle.style.display = 'flex';
      closeBtn.style.display = 'none';
      closeBtn.classList.remove('active');
    }
    toggleBurgerAnimation();
  });
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('no-scroll');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.style.display = 'flex';
    closeBtn.style.display = 'none';
    closeBtn.classList.remove('active');
    toggleBurgerAnimation();
  });
  
  overlay.addEventListener('click', function() {
    if (mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      body.classList.remove('no-scroll');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.style.display = 'flex';
      closeBtn.style.display = 'none';
      closeBtn.classList.remove('active');
      toggleBurgerAnimation();
    }
  });
  
  document.addEventListener('click', function(event) {
    if (!mobileMenu.contains(event.target) && 
        !mobileToggle.contains(event.target) && 
        !overlay.contains(event.target) &&
        mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      body.classList.remove('no-scroll');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.style.display = 'flex';
      closeBtn.style.display = 'none';
      closeBtn.classList.remove('active');
      toggleBurgerAnimation();
    }
  });
  
  const mobileMenuItems = mobileMenu.querySelectorAll('a');
  mobileMenuItems.forEach(item => {
    item.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      body.classList.remove('no-scroll');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.style.display = 'flex';
      closeBtn.style.display = 'none';
      closeBtn.classList.remove('active');
      toggleBurgerAnimation();
    });
  });
  
  function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.navbar__menu-link');
    const mobileMenuItems = document.querySelectorAll('.navbar__mobile-menu .navbar__menu-link');
    
    function checkAndSetActive(items) {
      items.forEach(item => {
        item.classList.remove('navbar__menu-link--active');
        
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
  
  setActiveMenuItem();
  
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const logo = document.querySelector('.navbar__logo');
    
    if (window.scrollY > 100) {
      navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
      
      if (logo) {
        logo.classList.add('navbar__logo--scrolled');
      }
    } else {
      navbar.style.backgroundColor = '';
      navbar.style.backdropFilter = '';
      
      if (logo) {
        logo.classList.remove('navbar__logo--scrolled');
      }
    }
  });
  
  const logo = document.querySelector('.navbar__logo');
  if (logo) {
    logo.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05) translateY(-5px) rotateY(10deg)';
    });
    
    logo.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
    
    logo.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / centerX * 10;
      const moveY = (y - centerY) / centerY * 7;
      
      this.style.transform = `scale(1.05) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
    });
  }
}); 