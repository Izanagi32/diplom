document.addEventListener("DOMContentLoaded",()=>{async function s(e){try{var t=await(await fetch("https://api.telegram.org/bot7378979804:AAGuviiwgUsrUprTP_NBm_wZn8iSH8l4a5U/sendMessage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:"1693054209",text:e,parse_mode:"HTML"})})).json();return console.log("📬 Telegram API:",t),t.ok}catch(e){return console.error("❗ Fetch error:",e),!1}}let y=document.getElementById("quoteForm"),_=document.getElementById("formModal");var t=document.getElementById("closeModal");let E=document.getElementById("total-volume"),M=document.getElementById("length"),x=document.getElementById("width"),L=document.getElementById("height"),k=document.getElementById("quantity");function a(){var e,t;E&&(t=M&&x&&L?(parseFloat(M.value)||0)*(parseFloat(x.value)||0)*(parseFloat(L.value)||0):0,e=parseInt(k?.value)||0,0<t)&&0<e&&(t=t*e,E.value&&"0"!==E.value||(E.value=t.toFixed(2)))}M&&x&&L&&k&&E&&[M,x,L,k].forEach(e=>e.addEventListener("input",a));let I=document.getElementById("adr"),S=document.getElementById("adr-class"),n=(I&&S&&I.addEventListener("change",()=>{S.hidden=!I.checked,S.disabled=!I.checked}),y?.addEventListener("submit",async e=>{e.preventDefault();var e=document.getElementById("pickup-location").value.trim(),t=document.getElementById("delivery-location").value.trim();if(e&&t){var a=parseFloat(M.value)||0,n=parseFloat(x.value)||0,o=parseFloat(L.value)||0,r=parseInt(k.value)||0,l=parseFloat(document.getElementById("weight").value)||0,i=parseFloat(E.value)||0,s=document.getElementById("pickup-date").value,d=document.getElementById("cargo-type").value.trim();if(d){var c=I.checked,u=S.value,m=document.getElementById("comment").value.trim()||"немає",p=document.getElementById("contact-name").value.trim(),v=document.getElementById("phone").value.trim(),b=document.getElementById("email").value.trim(),g=document.getElementById("attachment"),g=(0<g.files.length&&g.files[0].name,{pickupLocation:e,deliveryLocation:t,totalVolume:i,length:a,width:n,height:o,weight:l,quantity:r,cargoType:d,adr:c,adrClass:u,comment:m,pickupDate:s,contactName:p,phone:v,email:b});console.log("sending form",g);try{var f,h=await fetch("/api/requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(g)});h.ok?(_?.classList.add("modal--active"),y.reset(),E&&(E.value=""),S.hidden=!0,S.disabled=!0):(f=await h.text(),console.error("Request failed:",h.status,f),alert("Не вдалося відправити заявку."))}catch(e){console.error("Fetch error:",e),alert("Не вдалося відправити заявку.")}}else alert("Будь ласка, введіть тип вантажу.")}else alert("Будь ласка, заповніть поля Звідки та Куди.")}),t?.addEventListener("click",()=>{_?.classList.remove("modal--active")}),document.getElementById("contactModal"));var t=document.querySelector(".navbar__cta-button"),e=document.querySelector(".faq__cta-button"),o=document.querySelector(".hero__button-second"),r=document.querySelector(".submitModal__close");let d=document.getElementById("contactForm"),c=document.querySelector(".submitModal__thankyou");function l(){if(n.style.display="flex",document.body.style.overflow="hidden",setTimeout(()=>{n.classList.add("visible")},10),d){var e=localStorage.getItem("contactFormData");if(e)try{var t=JSON.parse(e);d.name.value=t.name||"",d.phone.value=t.phone||"",d.contact.value=t.contact||"phone",d.message.value=t.message||"",d.topic&&t.topic&&(d.topic.value=t.topic)}catch(e){console.error("Error restoring form data:",e)}}}function i(){var e;n.classList.remove("visible"),setTimeout(()=>{n.style.display="none",document.body.style.overflow="auto"},300),d&&(e={name:d.name.value,phone:d.phone.value,contact:d.contact.value,message:d.message.value},d.topic&&(e.topic=d.topic.value),localStorage.setItem("contactFormData",JSON.stringify(e)))}function u(e){if(!e.value)return 1;if("phone"===e.id&&!/^\+\d{3} \d{2} \d{3} \d{2} \d{2}$/.test(e.value))return void m(e,"Введіть номер у форматі +380 XX XXX XX XX");if(!("name"===e.id&&e.value.length<2))return p(e),1;m(e,"Ім'я повинно містити мінімум 2 символи")}function m(t,a){var n=t.closest(".submitModal__group");if(n){n.classList.add("invalid");let e=n.querySelector(".submitModal__error");e||((e=document.createElement("div")).className="submitModal__error",n.appendChild(e)),a?e.textContent=a:t.required?e.textContent="Це поле обов'язкове":e.textContent="Невірне значення",t.classList.add("shake"),setTimeout(()=>{t.classList.remove("shake")},500)}}function p(e){var e=e.closest(".submitModal__group");e&&(e.classList.remove("invalid"),e=e.querySelector(".submitModal__error"))&&e.remove()}function v(e,t="info"){let a=document.createElement("div");a.className="submitModal__toast submitModal__toast--"+t,a.textContent=e,document.body.appendChild(a),setTimeout(()=>{a.classList.add("submitModal__toast--visible")},10),setTimeout(()=>{a.classList.remove("submitModal__toast--visible"),setTimeout(()=>{a.remove()},300)},3e3)}if((d?.querySelectorAll("input, textarea, select"))?.forEach(e=>{let t=e.closest(".submitModal__group");e.addEventListener("focus",()=>{t.classList.add("focused")}),e.addEventListener("blur",()=>{t.classList.remove("focused")})}),t?.addEventListener("click",e=>{e.preventDefault(),l()}),e?.addEventListener("click",e=>{e.preventDefault(),l()}),o?.addEventListener("click",e=>{e.preventDefault(),l()}),r?.addEventListener("click",i),n?.addEventListener("click",e=>{e.target===n&&i()}),document.addEventListener("keydown",e=>{"Escape"===e.key&&"flex"===n?.style.display&&i()}),d?.addEventListener("submit",async t=>{t.preventDefault();var t=d.querySelector('button[type="submit"]'),a=t.innerHTML,e=(t.innerHTML='<span class="loading-dots">Надсилання</span>',t.disabled=!0,d.name.value.trim()),n=d.phone.value.trim(),o=d.contact.value,r=d.message.value.trim(),l=d.topic?d.topic.value:"Загальне питання",i=d.querySelector("#attachment"),e=`📞 <b>Зв'язок з менеджером</b>

`+`<b>Ім'я:</b> ${e}
`+`<b>Телефон:</b> ${n}
`+`<b>Спосіб зв'язку:</b> ${o}
`+`<b>Тема:</b> ${l}
`+(i&&0<i.files.length?`<b>Файл:</b> ${i.files[0].name}
`:"")+"<b>Коментар:</b> "+r;try{await new Promise(e=>setTimeout(e,1e3)),await s(e)?(d.style.display="none",c.style.display="block",localStorage.removeItem("contactFormData"),v("Повідомлення успішно надіслано!","success")):(t.innerHTML=a,t.disabled=!1,v("Не вдалося надіслати повідомлення. Спробуйте пізніше.","error"))}catch(e){console.error("Error sending form:",e),t.innerHTML=a,t.disabled=!1,v("Сталася помилка. Спробуйте пізніше.","error")}}),document.querySelectorAll(".site-footer__subscribe-button").forEach(e=>{e.addEventListener("click",async function(){var a=this.parentNode.querySelector(".site-footer__subscribe-input"),e=a.value.trim();if(e)if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e.toLowerCase()))if(await s(`📧 <b>Новий підписник</b>

<b>Email:</b> `+e)){a.value="";let e=this.parentNode,t=document.createElement("div");t.className="site-footer__subscribe-success",t.textContent="Дякуємо за підписку!",t.style.color="#3a97e8",t.style.fontSize="14px",t.style.marginTop="8px",e.appendChild(t),setTimeout(()=>{t.parentNode===e&&e.removeChild(t)},3e3)}else alert("Не вдалося підписатися. Спробуйте пізніше.");else alert("Будь ласка, введіть коректний email");else alert("Будь ласка, введіть ваш email")})}),d){(()=>{if(d){var e=document.createElement("div"),t=(e.className="submitModal__group",document.createElement("label"));t.setAttribute("for","topic"),t.className="submitModal__label",t.textContent="Тема звернення";let a=document.createElement("select");a.id="topic",a.name="topic",a.className="submitModal__select",a.required=!0;[{value:"general",text:"Загальне питання"},{value:"delivery",text:"Доставка вантажу"},{value:"tracking",text:"Відстеження замовлення"},{value:"pricing",text:"Ціни та оплата"},{value:"feedback",text:"Залишити відгук"},{value:"complaint",text:"Скарга"},{value:"partnership",text:"Співпраця"}].forEach(e=>{var t=document.createElement("option");t.value=e.value,t.textContent=e.text,a.appendChild(t)}),e.appendChild(t),e.appendChild(a);t=d.querySelector(".submitModal__group");t.parentNode.insertBefore(e,t.nextSibling),a}})(),(()=>{if(d){var e=document.createElement("div"),t=(e.className="submitModal__group",document.createElement("label"));t.setAttribute("for","attachment"),t.className="submitModal__label",t.textContent="Додати файл (необов'язково)";let a=document.createElement("input"),n=(a.type="file",a.id="attachment",a.name="attachment",a.className="submitModal__file",a.accept=".jpg,.jpeg,.png,.pdf,.doc,.docx",document.createElement("div"));n.className="submitModal__file-preview",e.appendChild(t),e.appendChild(a),e.appendChild(n);t=d.querySelector('button[type="submit"]');t.parentNode.insertBefore(e,t),a.addEventListener("change",()=>{var e,t;n.innerHTML="",0<a.files.length&&(5242880<(e=a.files[0]).size?(v("Файл повинен бути менше 5MB","error"),a.value=""):((t=document.createElement("div")).className="submitModal__file-name",t.innerHTML=`<span>${e.name}</span> <button type="button" class="submitModal__file-remove">×</button>`,t.querySelector(".submitModal__file-remove").addEventListener("click",()=>{a.value="",n.innerHTML=""}),n.appendChild(t)))}),a}})();(t=d.querySelector("#phone"))&&t.addEventListener("input",e=>{let t=e.target.value.replace(/\D/g,"");0<t.length&&(t=t.length<=3?"+"+t:t.length<=5?"+"+t.substring(0,3)+" "+t.substring(3):t.length<=8?"+"+t.substring(0,3)+" "+t.substring(3,5)+" "+t.substring(5):t.length<=10?"+"+t.substring(0,3)+" "+t.substring(3,5)+" "+t.substring(5,8)+" "+t.substring(8):"+"+t.substring(0,3)+" "+t.substring(3,5)+" "+t.substring(5,8)+" "+t.substring(8,10)+" "+t.substring(10,12)),e.target.value=t});t=d;if(t){let e=t.querySelectorAll("input, textarea, select");e.forEach(t=>{t.addEventListener("invalid",e=>{e.preventDefault(),m(t)}),t.addEventListener("focus",()=>{p(t)}),t.addEventListener("blur",()=>{(t.required&&!t.value?m:u)(t)})}),t.addEventListener("submit",t=>{let a=!0;return e.forEach(e=>{e.required&&!e.value?(t.preventDefault(),m(e),a=!1):u(e)||(t.preventDefault(),a=!1)}),a})}(t=document.createElement("style")).textContent=`
      .submitModal__error {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
      }
      
      .submitModal__group.invalid .submitModal__input,
      .submitModal__group.invalid .submitModal__select,
      .submitModal__group.invalid .submitModal__textarea {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
      }
      
      .submitModal__file {
        font-size: 0.9rem;
        padding: 0.5rem;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px dashed #ccc;
        width: 100%;
        cursor: pointer;
      }
      
      .submitModal__file-preview {
        margin-top: 0.5rem;
      }
      
      .submitModal__file-name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0.75rem;
        background: rgba(0, 91, 187, 0.1);
        border-radius: 6px;
        font-size: 0.9rem;
      }
      
      .submitModal__file-remove {
        background: rgba(0, 0, 0, 0.1);
        border: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1rem;
        color: #555;
        padding: 0;
        transition: all 0.2s ease;
      }
      
      .submitModal__file-remove:hover {
        background: rgba(231, 76, 60, 0.2);
        color: #e74c3c;
      }
      
      .submitModal__toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 0.8rem 1.5rem;
        background: #323232;
        color: white;
        border-radius: 4px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      
      .submitModal__toast--visible {
        transform: translateY(0);
        opacity: 1;
      }
      
      .submitModal__toast--error {
        background: #e74c3c;
      }
      
      .submitModal__toast--success {
        background: #2ecc71;
      }
      
      .submitModal__toast--info {
        background: #3498db;
      }
      
      .shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
      }
      
      @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
        40%, 60% { transform: translate3d(3px, 0, 0); }
      }
      
      .loading-dots:after {
        content: '...';
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { content: '.'; }
        33% { content: '..'; }
        66% { content: '...'; }
      }
    `,document.head.appendChild(t)}});