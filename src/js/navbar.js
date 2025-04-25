
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar__block-menu');
  
  if (!document.querySelector('.navbar__mobile-toggle')) {
    const mobileToggle = document.createElement('div');
    mobileToggle.className = 'navbar__mobile-toggle';
    mobileToggle.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    document.querySelector('.navbar__bottom').appendChild(mobileToggle);
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'navbar__mobile-menu';
    
    const menuClone = document.querySelector('.navbar__menu-list').cloneNode(true);
    mobileMenu.appendChild(menuClone);
    
    const ctaButton = document.querySelector('.navbar__cta-button');
    if (ctaButton) {
      const ctaClone = ctaButton.cloneNode(true);
      ctaClone.style.display = 'inline-block';
      mobileMenu.appendChild(ctaClone);
    }
    
    document.body.appendChild(mobileMenu);
  }
  
  const mobileToggle = document.querySelector('.navbar__mobile-toggle');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');
  const body = document.body;
  
  function toggleBurgerAnimation() {
    const spans = mobileToggle.querySelectorAll('span');
    
    if (mobileMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translateY(8px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }
  
  mobileToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    body.classList.toggle('no-scroll');
    toggleBurgerAnimation();
  });
  
  document.addEventListener('click', function(event) {
    if (!mobileMenu.contains(event.target) && 
        !mobileToggle.contains(event.target) && 
        mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      body.classList.remove('no-scroll');
      toggleBurgerAnimation();
    }
  });
  
  const mobileMenuItems = mobileMenu.querySelectorAll('a');
  mobileMenuItems.forEach(item => {
    item.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      body.classList.remove('no-scroll');
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