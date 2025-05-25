# Налаштування Supabase для EuroTandem

## 1. Створення таблиці в Supabase

Перейдіть до вашого проекту Supabase (Project ID: lzhbhcmygndxufiowywn) та виконайте наступний SQL запит в SQL Editor:

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

-- Створення індексу для швидкого сортування за датою створення
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);

-- Увімкнення Row Level Security (RLS)
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Створення політики для читання (дозволити всім читати)
CREATE POLICY "Allow read access for all users" ON requests
  FOR SELECT USING (true);

-- Створення політики для вставки (дозволити всім вставляти)
CREATE POLICY "Allow insert access for all users" ON requests
  FOR INSERT WITH CHECK (true);
```

## 2. Налаштування змінних середовища

Додайте наступні змінні середовища до вашого Netlify проекту:

### В Netlify Dashboard:
1. Перейдіть до Site settings > Environment variables
2. Додайте наступні змінні:

```
SUPABASE_URL=https://lzhbhcmygndxufiowywn.supabase.co
SUPABASE_ANON_KEY=ваш_anon_key_з_supabase
```

### Як отримати SUPABASE_ANON_KEY:
1. Перейдіть до вашого проекту в Supabase
2. Відкрийте Settings > API
3. Скопіюйте значення з поля "anon public"

## 3. Встановлення залежностей

Виконайте команду для встановлення нових залежностей:

```bash
npm install
```

## 4. Тестування

Після налаштування:
1. Заповніть форму на головній сторінці
2. Перевірте, чи з'явилася заявка в Supabase Dashboard > Table Editor > requests
3. Перевірте, чи працює адмін панель для перегляду заявок

## 5. Міграція існуючих даних (якщо потрібно)

Якщо у вас є існуючі дані в Turso, які потрібно перенести, зверніться за допомогою для створення скрипта міграції. 