# Документація API та Компонентів
## Логістичне Додаток для Заявок на Перевезення

### Зміст
- [Огляд системи](#огляд-системи)
- [Серверні API](#серверні-api)
- [Клієнтські компоненти](#клієнтські-компоненти)
- [Утиліти та допоміжні функції](#утиліти-та-допоміжні-функції)
- [Приклади використання](#приклади-використання)
- [Конфігурація](#конфігурація)

---

## Огляд системи

Система складається з:
- **Клієнтська частина**: HTML-сторінки з інтерактивними формами
- **Серверна частина**: Netlify Functions з інтеграцією Supabase
- **Адмін-панель**: Повнофункціональний інтерфейс управління заявками
- **Інтеграції**: Telegram-сповіщення, аналітика, карти

---

## Серверні API

### 1. API Заявок (`/api/requests`)

#### Отримання всіх заявок
```http
GET /api/requests
```

**Відповідь:**
```json
[
  {
    "id": 1,
    "pickupLocation": "Київ",
    "deliveryLocation": "Львів",
    "totalVolume": 12.5,
    "length": 2.5,
    "width": 2.0,
    "height": 2.5,
    "weight": 1500,
    "quantity": 1,
    "cargoType": "Будівельні матеріали",
    "adr": false,
    "adrClass": null,
    "comment": "Терміново",
    "pickupDate": "2024-01-15",
    "contactName": "Іван Петренко",
    "phone": "+380123456789",
    "email": "ivan@example.com",
    "status": "pending",
    "priority": "medium",
    "statusComment": null,
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
]
```

#### Створення нової заявки
```http
POST /api/requests
Content-Type: application/json
```

**Тіло запиту:**
```json
{
  "pickupLocation": "Київ, вул. Хрещатик 1",
  "deliveryLocation": "Львів, вул. Городоцька 10",
  "totalVolume": 8.0,
  "length": 2.0,
  "width": 2.0,
  "height": 2.0,
  "weight": 1000,
  "quantity": 1,
  "cargoType": "Меблі",
  "adr": false,
  "adrClass": null,
  "comment": "Обережно з вантажем",
  "pickupDate": "2024-01-20",
  "contactName": "Марія Іваненко",
  "phone": "+380987654321",
  "email": "maria@example.com"
}
```

**Відповідь:**
```json
{
  "success": true,
  "id": "123"
}
```

#### Оновлення заявки
```http
PUT /api/requests
Content-Type: application/json
```

**Тіло запиту:**
```json
{
  "id": 123,
  "status": "approved",
  "statusComment": "Заявка схвалена, очікуйте дзвінка",
  "priority": "high"
}
```

#### Видалення заявки
```http
DELETE /api/requests?id=123
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Request deleted successfully",
  "deletedId": "123"
}
```

---

## Клієнтські компоненти

### 1. AdminPanel (Адмін-панель)

**Опис:** Головний клас для управління адміністративним інтерфейсом

```javascript
class AdminPanel {
  constructor()
  async init()
  checkAuthentication()
  async loadRequests()
  applyFilters()
  sortData(column)
  renderTable()
  async viewRequest(id)
  async editRequest(id)
  async changeStatus(id)
  async deleteRequest(id)
  exportData()
}
```

**Приклад використання:**
```javascript
// Ініціалізація адмін-панелі
const adminPanel = new AdminPanel();

// Завантаження заявок
await adminPanel.loadRequests();

// Застосування фільтрів
adminPanel.filters.status = 'pending';
adminPanel.applyFilters();

// Експорт даних
adminPanel.exportData();
```

**Методи:**

#### `checkAuthentication()`
Перевіряє авторизацію користувача.

**Повертає:** `boolean`

```javascript
const isAuthenticated = adminPanel.checkAuthentication();
if (!isAuthenticated) {
  window.location.href = './admin-login.html';
}
```

#### `loadRequests()`
Завантажує заявки з сервера.

**Повертає:** `Promise<void>`

```javascript
try {
  await adminPanel.loadRequests();
  console.log('Заявки завантажено');
} catch (error) {
  console.error('Помилка завантаження:', error);
}
```

#### `applyFilters()`
Застосовує фільтри до списку заявок.

```javascript
// Встановлення фільтрів
adminPanel.filters = {
  status: 'approved',
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31',
  search: 'Київ'
};
adminPanel.applyFilters();
```

### 2. AnalyticsModule (Модуль аналітики)

**Опис:** Модуль для відображення аналітики та звітності

```javascript
class AnalyticsModule {
  constructor(adminPanel)
  renderAnalyticsTab()
  initializeCharts()
  createRequestsTimeChart(data)
  createStatusChart(data)
  updateKPIs(data)
  generateAnalyticsReport()
}
```

**Приклад використання:**
```javascript
// Ініціалізація модуля аналітики
const analytics = new AnalyticsModule(adminPanel);

// Відображення вкладки аналітики
analytics.renderAnalyticsTab();

// Генерація звіту
analytics.generateAnalyticsReport();
```

### 3. Форма заявки (Shipping Form)

**Опис:** Головна форма для подачі заявок на перевезення

**Основні функції:**
- Валідація даних
- Автоматичний розрахунок об'єму
- Інтеграція з ADR класифікацією
- Відправка в Telegram

**Приклад використання:**
```javascript
// Ініціалізація форми
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quoteForm");
  
  // Обробка відправки
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = {
      pickupLocation: document.getElementById('pickup-location').value,
      deliveryLocation: document.getElementById('delivery-location').value,
      // ... інші поля
    };
    
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        showSuccessModal();
      }
    } catch (error) {
      console.error('Помилка:', error);
    }
  });
});
```

### 4. Інтерактивна карта (Map Component)

**Опис:** Компонент для відображення маршрутів та географічних даних

```javascript
// Ініціалізація карти
const map = L.map("map").setView([50.4501, 30.5234], 6);

// Додавання шарів
const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
const trafficLayer = L.tileLayer("https://api.tomtom.com/traffic/map/4/flow/absolute/tile/{z}/{x}/{y}.png");

// Керування маршрутами
const routingControl = RouteManager.initRouting(map);

// Завантаження геоданих
async function loadGeoJSON(url) {
  const response = await fetch(url);
  return await response.json();
}
```

**Функції карти:**
- `renderMarkers(region)` - Відображення маркерів по регіонах
- `highlightCountries()` - Підсвітка країн
- `loadGeoJSON(url)` - Завантаження геоданих

### 5. Компонент навігації (Navbar)

**Опис:** Адаптивна навігаційна панель

```javascript
// Активація мобільного меню
const mobileToggle = document.querySelector('.navbar__mobile-toggle');
const mobileMenu = document.querySelector('.navbar__mobile-menu');

mobileToggle.addEventListener('click', function() {
  mobileMenu.classList.toggle('active');
  document.body.classList.toggle('no-scroll');
});

// Встановлення активного пункту меню
function setActiveMenuItem() {
  const currentPath = window.location.pathname;
  const menuItems = document.querySelectorAll('.navbar__menu-link');
  
  menuItems.forEach(item => {
    const itemPath = item.getAttribute('href');
    if (itemPath === currentPath) {
      item.classList.add('navbar__menu-link--active');
    }
  });
}
```

---

## Утиліти та допоміжні функції

### 1. RouteManager (Менеджер маршрутів)

```javascript
const RouteManager = {
  // Завантаження GeoJSON файлів
  async loadGeoJSON(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Помилка завантаження GeoJSON:', error);
      return null;
    }
  },

  // Ініціалізація маршрутизації
  initRouting(map) {
    return L.Routing.control({
      waypoints: [],
      routeWhileDragging: true,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      })
    }).addTo(map);
  }
};
```

### 2. Валідація форм

```javascript
// Валідація телефонних номерів
function validatePhoneNumber(phone) {
  const phonePattern = /^\+\d{3} \d{2} \d{3} \d{2} \d{2}$/;
  return phonePattern.test(phone);
}

// Валідація email
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Форматування номера телефону
function formatPhoneNumber(phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    // Логіка форматування...
  });
}
```

### 3. Сповіщення

```javascript
// Telegram інтеграція
async function sendTelegramMessage(message) {
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  });
  
  return response.json();
}

// Показ повідомлень користувачу
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
}
```

---

## Приклади використання

### 1. Створення нової заявки

```javascript
// Клієнтський код
const requestData = {
  pickupLocation: "Київ, вул. Хрещатик 1",
  deliveryLocation: "Одеса, вул. Дерибасівська 10",
  totalVolume: 15.0,
  length: 3.0,
  width: 2.5,
  height: 2.0,
  weight: 2000,
  quantity: 1,
  cargoType: "Електроніка",
  adr: false,
  comment: "Обережно з вантажем, дорогий товар",
  pickupDate: "2024-01-25",
  contactName: "Олександр Коваленко",
  phone: "+380501234567",
  email: "oleksandr@example.com"
};

fetch('/api/requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestData)
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Заявка створена з ID:', data.id);
    showSuccessMessage('Заявка успішно відправлена!');
  }
});
```

### 2. Робота з адмін-панеллю

```javascript
// Ініціалізація адмін-панелі
const adminPanel = new AdminPanel();

// Завантаження та фільтрація заявок
await adminPanel.loadRequests();

// Встановлення фільтрів
adminPanel.filters.status = 'pending';
adminPanel.filters.dateFrom = '2024-01-01';
adminPanel.applyFilters();

// Зміна статусу заявки
await adminPanel.changeStatus(123);

// Експорт даних
adminPanel.exportData();
```

### 3. Робота з картою

```javascript
// Ініціалізація карти
const map = L.map("map").setView([50.4501, 30.5234], 6);

// Додавання базового шару
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// Ініціалізація маршрутизації
const routingControl = RouteManager.initRouting(map);

// Встановлення маршруту
routingControl.setWaypoints([
  L.latLng(50.4501, 30.5234), // Київ
  L.latLng(49.8397, 24.0297)  // Львів
]);

// Завантаження кордонів країн
const ukraineGeoJSON = await RouteManager.loadGeoJSON('src/data/geoBoundaries-UKR-ADM0.geojson');
if (ukraineGeoJSON) {
  L.geoJSON(ukraineGeoJSON, {
    style: { color: '#ff7800', weight: 2, fillOpacity: 0.1 }
  }).addTo(map);
}
```

### 4. Аналітика та звіти

```javascript
// Ініціалізація модуля аналітики
const analytics = new AnalyticsModule(adminPanel);

// Відображення аналітики
analytics.renderAnalyticsTab();

// Оновлення KPI
analytics.updateKPIs(adminPanel.currentData);

// Створення графіків
analytics.createRequestsTimeChart(adminPanel.currentData);
analytics.createStatusChart(adminPanel.currentData);

// Генерація звіту
analytics.generateAnalyticsReport();
```

---

## Конфігурація

### 1. Змінні середовища

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### 2. Налаштування бази даних

```sql
-- Структура таблиці requests
CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  total_volume DECIMAL(10,2),
  length DECIMAL(10,2),
  width DECIMAL(10,2),
  height DECIMAL(10,2),
  weight DECIMAL(10,2),
  quantity INTEGER,
  cargo_type TEXT,
  adr BOOLEAN DEFAULT FALSE,
  adr_class TEXT,
  comment TEXT,
  pickup_date DATE,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  status_comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Статуси заявок

```javascript
const STATUS_CONFIG = {
  pending: { 
    name: 'В очікуванні', 
    color: '#f59e0b', 
    icon: 'fas fa-clock' 
  },
  approved: { 
    name: 'Схвалено', 
    color: '#22c55e', 
    icon: 'fas fa-check' 
  },
  rejected: { 
    name: 'Відхилено', 
    color: '#ef4444', 
    icon: 'fas fa-times' 
  },
  'in-progress': { 
    name: 'В процесі', 
    color: '#06b6d4', 
    icon: 'fas fa-spinner' 
  },
  completed: { 
    name: 'Завершено', 
    color: '#1e40af', 
    icon: 'fas fa-check-circle' 
  }
};
```

### 4. Класи ADR

```javascript
const ADR_CLASSES = {
  'class-1': 'Клас 1 - Вибухові речовини',
  'class-2': 'Клас 2 - Гази',
  'class-3': 'Клас 3 - Легкозаймисті рідини',
  'class-4': 'Клас 4 - Легкозаймисті тверді речовини',
  'class-5': 'Клас 5 - Окислювачі',
  'class-6': 'Клас 6 - Отруйні речовини',
  'class-7': 'Клас 7 - Радіоактивні матеріали',
  'class-8': 'Клас 8 - Їдкі речовини',
  'class-9': 'Клас 9 - Різні небезпечні речовини'
};
```

---

## Підтримка та розвиток

### Структура проекту
```
/
├── src/
│   ├── js/           # JavaScript модулі
│   ├── css/          # Стилі
│   ├── img/          # Зображення
│   └── data/         # GeoJSON файли
├── netlify/
│   └── functions/    # Серверні функції
├── *.html           # HTML сторінки
└── package.json     # Залежності
```

### Основні залежності
- **Supabase** - База даних та авторизація
- **Leaflet** - Інтерактивні карти
- **Chart.js** - Графіки та аналітика
- **Node-fetch** - HTTP запити
- **Dotenv** - Управління конфігурацією

### Тестування
```bash
# Локальний розвиток
npm install
netlify dev

# Деплой
netlify deploy --prod
```

Ця документація покриває всі публічні API, функції та компоненти системи управління логістичними заявками з детальними прикладами використання та інструкціями налаштування.