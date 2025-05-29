let ROUTING_API_URL="https://router.project-osrm.org/route/v1";async function loadGeoJSON(r){try{var e=await fetch(r);if(e.ok)return await e.json();throw new Error(`Помилка завантаження ${r}: `+e.status)}catch(r){return console.error("Помилка завантаження GeoJSON:",r),showError("Не вдалося завантажити дані: "+r.message),null}}function initRouting(r){r=L.Routing.control({waypoints:[],routeWhileDragging:!0,showAlternatives:!1,router:L.Routing.osrmv1({serviceUrl:ROUTING_API_URL,timeout:5e3})}).addTo(r);return r.on("routingerror",r=>{showError("Не вдалося побудувати маршрут. Перевірте підключення або спробуйте пізніше."),console.error("Помилка маршрутизації:",r.error)}),r}function showError(r){let e=document.getElementById("error-message")||createErrorElement();e.textContent=r,e.style.display="block",setTimeout(()=>e.style.display="none",5e3)}function createErrorElement(){var r=document.createElement("div");return r.id="error-message",r.style=`
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #f44336;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 10000;
    display: none;
  `,document.body.appendChild(r),r}export default{loadGeoJSON:loadGeoJSON,initRouting:initRouting};export{initRouting};