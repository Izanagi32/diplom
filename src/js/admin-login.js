document.addEventListener("DOMContentLoaded",()=>{var e,t,a=document.getElementById("login-form");let n=document.getElementById("login-error"),o=document.getElementById("toggle-password"),m=document.getElementById("password"),r=document.getElementById("remember-me");function s(e){n&&(n.textContent=e,n.style.display="block",n.classList.add("shake"),setTimeout(()=>{n.classList.remove("shake")},500))}d="true"===localStorage.getItem("adminLoggedIn"),e=localStorage.getItem("adminLoginTime"),t="true"===sessionStorage.getItem("adminLoggedIn"),d?(d=Date.now(),e=parseInt(e,10),d-e<6048e5?window.location.href="./admin.html":(localStorage.removeItem("adminLoggedIn"),localStorage.removeItem("adminLoginTime"))):t&&(window.location.href="./admin.html"),o&&m&&o.addEventListener("click",()=>{var e="password"===m.getAttribute("type")?"text":"password",e=(m.setAttribute("type",e),o.querySelector("i"));e.classList.toggle("fa-eye"),e.classList.toggle("fa-eye-slash")}),a&&a.addEventListener("submit",e=>{e.preventDefault(),n.textContent="";var e=document.getElementById("username").value.trim(),t=document.getElementById("password").value.trim();e&&t?"admin"===e&&"password123"===t?(r.checked?(localStorage.setItem("adminLoggedIn","true"),localStorage.setItem("adminLoginTime",Date.now().toString())):sessionStorage.setItem("adminLoggedIn","true"),window.location.href="./admin.html"):(s("Невірний логін або пароль. Спробуйте ще раз."),m.value=""):s("Будь ласка, введіть логін та пароль.")});var d=document.createElement("style");d.textContent=`
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
  `,document.head.appendChild(d)});