# Оновлення таблиці Supabase для підтримки статусів

## 🔧 Що потрібно зробити:

### 1. Виконати SQL запит в Supabase

Перейдіть до вашого проекту Supabase: https://supabase.com/dashboard/project/lzhbhcmygndxufiowywn

Відкрийте **SQL Editor** і виконайте наступний SQL код:

```sql
-- Додавання полів статусу та пріоритету до таблиці requests
ALTER TABLE requests 
ADD COLUMN status TEXT DEFAULT 'pending',
ADD COLUMN priority TEXT DEFAULT 'medium',
ADD COLUMN status_comment TEXT,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Створення індексу для статусу
CREATE INDEX idx_requests_status ON requests(status);

-- Створення функції для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Створення тригера для автоматичного оновлення updated_at
CREATE TRIGGER update_requests_updated_at 
    BEFORE UPDATE ON requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Додавання політики для оновлення (дозволити всім)
CREATE POLICY "Allow update access for all users" ON requests
  FOR UPDATE USING (true);

-- Додавання політики для видалення (дозволити всім)
CREATE POLICY "Allow delete access for all users" ON requests
  FOR DELETE USING (true);
```

### 2. Перевірити результат

Після виконання SQL запиту:

1. Перейдіть до **Table Editor** → **requests**
2. Переконайтеся, що додалися нові колонки:
   - `status` (TEXT, default: 'pending')
   - `priority` (TEXT, default: 'medium') 
   - `status_comment` (TEXT)
   - `updated_at` (TIMESTAMP WITH TIME ZONE)

### 3. Протестувати функціональність

Після деплою нових змін:

1. **Зміна статусу**: В адмін панелі спробуйте змінити статус заявки
2. **Редагування**: Спробуйте відредагувати заявку
3. **Видалення**: Спробуйте видалити заявку
4. **Перевірка в Supabase**: Переконайтеся, що зміни відображаються в таблиці

## ✅ Що було додано:

### Нові поля в таблиці:
- **status**: Статус заявки (pending, approved, rejected, in-progress, completed)
- **priority**: Пріоритет (low, medium, high)
- **status_comment**: Коментар до зміни статусу
- **updated_at**: Дата останнього оновлення (автоматично оновлюється)

### Нова функціональність API:
- **PUT /api/requests**: Оновлення заявки (статус, пріоритет, всі поля)
- **DELETE /api/requests?id=X**: Видалення заявки

### Оновлена адмін панель:
- Зміна статусу тепер зберігається в базі даних
- Редагування заявок зберігається в базі даних  
- Видалення заявок працює через API
- Додано індикатори завантаження
- Покращена обробка помилок

## 🎯 Статуси заявок:

- **pending** (В очікуванні) - нова заявка
- **approved** (Схвалено) - заявка прийнята
- **rejected** (Відхилено) - заявка відхилена
- **in-progress** (В процесі) - заявка виконується
- **completed** (Завершено) - заявка завершена

## 🔄 Пріоритети:

- **low** (Низький)
- **medium** (Середній) - за замовчуванням
- **high** (Високий) 