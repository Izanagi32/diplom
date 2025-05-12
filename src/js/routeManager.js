
const ROUTING_API_URL = 'https://router.project-osrm.org/route/v1';

async function loadGeoJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Помилка завантаження ${url}: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Помилка завантаження GeoJSON:', error);
    showError(`Не вдалося завантажити дані: ${error.message}`);
    return null;
  }
}

export function initRouting(map) {
  const routingControl = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    showAlternatives: false,
    router: L.Routing.osrmv1({
      serviceUrl: ROUTING_API_URL,
      timeout: 5000 // 5 секунд таймауту
    })
  }).addTo(map);

  routingControl.on('routingerror', (e) => {
    showError('Не вдалося побудувати маршрут. Перевірте підключення або спробуйте пізніше.');
    console.error('Помилка маршрутизації:', e.error);
  });

  return routingControl;
}

function showError(message) {
  const errorElement = document.getElementById('error-message') || createErrorElement();
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => errorElement.style.display = 'none', 5000);
}

function createErrorElement() {
  const div = document.createElement('div');
  div.id = 'error-message';
  div.style = `
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
  `;
  document.body.appendChild(div);
  return div;
}

export default {
  loadGeoJSON,
  initRouting
};
