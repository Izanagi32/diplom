document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorDisplay = document.getElementById('login-error');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  const rememberMeCheckbox = document.getElementById('remember-me');
  
  checkAuthorization();
  
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      const eyeIcon = togglePasswordBtn.querySelector('i');
      eyeIcon.classList.toggle('fa-eye');
      eyeIcon.classList.toggle('fa-eye-slash');
    });
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      errorDisplay.textContent = '';
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      
      if (!username || !password) {
        showError('Будь ласка, введіть логін та пароль.');
        return;
      }
      
      const validUsername = 'admin';
      const validPassword = 'password123';
      
      if (username === validUsername && password === validPassword) {
        
        if (rememberMeCheckbox.checked) {
          localStorage.setItem('adminLoggedIn', 'true');
          localStorage.setItem('adminLoginTime', Date.now().toString());
        } else {
          sessionStorage.setItem('adminLoggedIn', 'true');
        }
        
        window.location.href = './admin.html';
      } else {
        showError('Невірний логін або пароль. Спробуйте ще раз.');
        passwordInput.value = '';
      }
    });
  }
  
  function showError(message) {
    if (errorDisplay) {
      errorDisplay.textContent = message;
      errorDisplay.style.display = 'block';
      
      errorDisplay.classList.add('shake');
      setTimeout(() => {
        errorDisplay.classList.remove('shake');
      }, 500);
    }
  }
  
  function checkAuthorization() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const loginTime = localStorage.getItem('adminLoginTime');
    
    const isSessionLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
      const now = Date.now();
      const loginTimeValue = parseInt(loginTime, 10);
      
      const expirationTime = 7 * 24 * 60 * 60 * 1000;
      
      if (now - loginTimeValue < expirationTime) {
        window.location.href = './admin.html';
      } else {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminLoginTime');
      }
    } else if (isSessionLoggedIn) {
      window.location.href = './admin.html';
    }
  }
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
  `;
  document.head.appendChild(style);
}); 