# Міграція з Turso на Supabase - Інструкції

## ✅ Що вже зроблено:

1. **Оновлено залежності**: Замінено `@libsql/client` на `@supabase/supabase-js`
2. **Оновлено API функцію**: Файл `netlify/functions/api-requests.js` тепер працює з Supabase
3. **Встановлено залежності**: Виконано `npm install`

## 🔧 Що потрібно зробити:

### 1. Створити таблицю в Supabase

1. Перейдіть до вашого проекту Supabase: https://supabase.com/dashboard/project/lzhbhcmygndxufiowywn
2. Відкрийте **SQL Editor**
3. Виконайте наступний SQL код:

```sql
-- Створення таблиці requests
CREATE TABLE requests (
  id BIGSERIAL PRIMARY KEY,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  length REAL NOT NULL,
  width REAL NOT NULL,
  height REAL NOT NULL,
  weight REAL NOT NULL,
  quantity INTEGER NOT NULL,
  cargo_type TEXT NOT NULL,
  adr BOOLEAN DEFAULT FALSE,
  adr_class TEXT,
  comment TEXT,
  pickup_date TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Створення індексу для швидкого сортування
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);

-- Увімкнення Row Level Security
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Політика для читання (дозволити всім)
CREATE POLICY "Allow read access for all users" ON requests
  FOR SELECT USING (true);

-- Політика для вставки (дозволити всім)
CREATE POLICY "Allow insert access for all users" ON requests
  FOR INSERT WITH CHECK (true);
```

### 2. Налаштувати змінні середовища в Netlify

1. Перейдіть до вашого сайту в Netlify Dashboard
2. Відкрийте **Site settings** → **Environment variables**
3. Додайте наступні змінні:

```
SUPABASE_URL=https://lzhbhcmygndxufiowywn.supabase.co
SUPABASE_ANON_KEY=ваш_anon_key_з_supabase
```

### 3. Отримати SUPABASE_ANON_KEY

1. В Supabase Dashboard перейдіть до **Settings** → **API**
2. Скопіюйте значення з поля **anon public**
3. Вставте його як значення для `SUPABASE_ANON_KEY` в Netlify

### 4. Видалити старі змінні Turso (опціонально)

Можете видалити наступні змінні з Netlify:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

### 5. Деплой та тестування

1. Зробіть commit та push змін до репозиторію
2. Дочекайтеся завершення деплою в Netlify
3. Протестуйте:
   - Заповніть форму на головній сторінці
   - Перевірте, чи з'явилася заявка в Supabase Dashboard → **Table Editor** → **requests**
   - Перевірте адмін панель на предмет відображення заявок

## 🔍 Перевірка роботи

### Тестування форми:
1. Відкрийте головну сторінку сайту
2. Заповніть форму "Отримати розрахунок"
3. Відправте форму
4. Перевірте в Supabase Dashboard, чи з'явився новий запис

### Тестування адмін панелі:
1. Увійдіть в адмін панель
2. Перевірте, чи відображаються заявки
3. Спробуйте фільтри та сортування

## 🚨 Можливі проблеми та рішення

### Помилка "Invalid API key"
- Перевірте правильність `SUPABASE_ANON_KEY`
- Переконайтеся, що змінні середовища збережені в Netlify

### Помилка "relation does not exist"
- Переконайтеся, що таблиця `requests` створена в Supabase
- Перевірте правильність SQL запиту

### Помилка "Row Level Security"
- Переконайтеся, що політики RLS створені правильно
- Перевірте, що політики дозволяють читання та вставку

## 📊 Структура таблиці

Таблиця `requests` містить наступні поля:

| Поле | Тип | Опис |
|------|-----|------|
| id | BIGSERIAL | Унікальний ідентифікатор |
| pickup_location | TEXT | Місце завантаження |
| delivery_location | TEXT | Місце доставки |
| length | REAL | Довжина вантажу |
| width | REAL | Ширина вантажу |
| height | REAL | Висота вантажу |
| weight | REAL | Вага вантажу |
| quantity | INTEGER | Кількість |
| cargo_type | TEXT | Тип вантажу |
| adr | BOOLEAN | Чи є ADR вантаж |
| adr_class | TEXT | Клас ADR |
| comment | TEXT | Коментар |
| pickup_date | TEXT | Дата подачі |
| contact_name | TEXT | Ім'я контакту |
| phone | TEXT | Телефон |
| email | TEXT | Email |
| created_at | TIMESTAMP | Дата створення |

## 🎯 Переваги Supabase

- **Реальний час**: Можливість підписки на зміни в таблиці
- **Автентифікація**: Вбудована система користувачів
- **API**: Автоматично згенерований REST API
- **Dashboard**: Зручний інтерфейс для управління даними
- **Безкоштовний план**: До 500MB бази даних безкоштовно 