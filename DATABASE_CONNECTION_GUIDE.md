# 🗄️ Підключення Адмін Панелі до База Даних

## Поточний стан

✅ **Адмін панель ПІДКЛЮЧЕНА до реальної бази даних Turso SQLite**

### Що вже налаштовано:

1. **API ендпоінти** - `/api/requests` підтримує всі операції
2. **База даних** - Turso SQLite з розширеною схемою
3. **Автентифікація** - збережена з попередньої версії
4. **CRUD операції** - Create, Read, Update, Delete

## 🔧 Технічні деталі

### База даних (Turso SQLite)
```sql
CREATE TABLE requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pickupLocation TEXT,
  deliveryLocation TEXT,
  length REAL,
  width REAL, 
  height REAL,
  weight REAL,
  quantity INTEGER,
  cargoType TEXT,
  adr BOOLEAN,
  adrClass TEXT,
  comment TEXT,
  pickupDate TEXT,
  contactName TEXT,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  assignedTo TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API ендпоінти
- `GET /api/requests` - отримати всі заявки
- `POST /api/requests` - створити нову заявку  
- `PUT /api/requests/:id` - оновити заявку
- `DELETE /api/requests/:id` - видалити заявку

### Змінні оточення
```env
TURSO_DATABASE_URL=your_database_url
TURSO_AUTH_TOKEN=your_auth_token
TELEGRAM_BOT_TOKEN=your_telegram_token
TELEGRAM_CHAT_ID=your_chat_id
```

## 🎮 Режими роботи

### 1. Production режим (за замовчуванням)
- Підключення до реальної БД
- Всі дані зберігаються постійно
- Telegram сповіщення працюють

### 2. Demo режим  
```javascript
// Увімкнути demo режим
AdminUtils.toggleDemoMode();

// Або в консолі
localStorage.setItem('admin_demo_mode', 'true');
location.reload();
```

## 📊 Функціональність

### ✅ Працює з реальною БД:
- [x] Перегляд всіх заявок
- [x] Фільтрація та пошук
- [x] Сортування
- [x] Зміна статусу заявок
- [x] Призначення відповідальних
- [x] Видалення заявок
- [x] Експорт в CSV
- [x] Статистика в реальному часі

### 🔄 Автоматичні функції:
- Визначення пріоритету на основі типу вантажу
- Оновлення timestamp при змінах
- Telegram сповіщення про нові заявки
- Автоматичне оновлення даних кожні 30 секунд

## 🚀 Як запустити

1. **Перевірити змінні оточення:**
```bash
# У файлі .env повинні бути:
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

2. **Запустити сервер:**
```bash
netlify dev
# або
npm run dev
```

3. **Відкрити адмін панель:**
```
http://localhost:8888/admin-enhanced.html
```

## 🔍 Як перевірити підключення

### В консолі браузера:
```javascript
// Перевірити режим
AdminUtils.getCurrentMode(); // повинно показати "Production"

// Перевірити конфігурацію  
AdminUtils.logConfig();

// Тестовий запит до API
fetch('/api/requests').then(r => r.json()).then(console.log);
```

### Ознаки успішного підключення:
- ✅ Дані завантажуються з реальної БД
- ✅ Зміни зберігаються після перезавантаження
- ✅ Нові заявки з форми з'являються в адмін панелі
- ✅ Статуси змінюються і зберігаються

## 🛠️ Налагодження проблем

### Проблема: "Помилка завантаження заявок"
```javascript
// Перевірити у Network tab DevTools
// Чи відповідає API endpoint /api/requests

// Перевірити змінні оточення
console.log('DB URL:', process.env.TURSO_DATABASE_URL);
```

### Проблема: Зміни не зберігаються
```javascript
// Перевірити чи не увімкнений demo режим
localStorage.getItem('admin_demo_mode'); // має бути null

// Видалити demo режим
localStorage.removeItem('admin_demo_mode');
location.reload();
```

### Проблема: 500 Internal Server Error
- Перевірити логи Netlify Functions
- Перевірити правильність токенів Turso
- Перевірити підключення до інтернету

## 📈 Моніторинг

### Логи в консолі:
```
⚙️ Admin Config loaded - Mode: Production
📊 Real database mode enabled  
Enhanced Admin Panel initialized with real database connection
```

### Network запити:
- `GET /api/requests` - отримання даних
- `PUT /api/requests/123` - оновлення
- `DELETE /api/requests/123` - видалення

## 🔐 Безпека

### Автентифікація:
- Сесія зберігається в localStorage/sessionStorage
- Час життя сесії: 7 днів
- Автоматичний logout при закінченні сесії

### Валідація:
- Перевірка прав доступу
- Валідація даних на сервері
- Escape HTML для запобігання XSS

## 📞 Підтримка

При виникненні проблем:
1. Перевірити консоль браузера на помилки
2. Перевірити Network tab на API запити  
3. Перевірити логи Netlify Functions
4. Звернутися до розробника

---

**Статус: ✅ ПІДКЛЮЧЕНО ДО РЕАЛЬНОЇ БД**  
**Останнє оновлення:** січень 2024 