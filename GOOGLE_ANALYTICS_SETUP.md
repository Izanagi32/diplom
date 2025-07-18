# 📊 Google Analytics Налаштування для Euro Tandem

## 🚀 Крок за кроком

### 1. Створення Google Analytics 4 акаунту
1. Йдіть на [analytics.google.com](https://analytics.google.com)
2. Натисніть "Почати безкоштовно"
3. Створіть акаунт з назвою "Euro Tandem"
4. Створіть властивість з назвою "eurotandem.com"
5. Оберіть часовий пояс: Europe/Kiev
6. Валюта: Ukrainian Hryvnia (UAH)

### 2. Отримання Tracking ID
1. У панелі GA4 йдіть в **Адміністрування** > **Потоки даних**
2. Створіть веб-потік для домену: `eurotandem.com`
3. Скопіюйте **Measurement ID** (формат: G-XXXXXXXXXX)

### 3. Заміна коду на сайті
**ВАЖЛИВО:** Замініть `G-XXXXXXXXXX` у всіх HTML файлах на ваш реальний ID:

```bash
# У всіх файлах замінити:
G-XXXXXXXXXX → ваш_реальний_ID

# Файли для заміни:
- index.html
- aboutus.html  
- map.html
- faq.html
- terms.html
- privacy-policy.html
```

### 4. Налаштування цілей та подій

#### 🎯 Рекомендовані події для відстеження:
- **form_submit** - заповнення форм замовлення
- **social_click** - кліки по соціальних мережах  
- **phone_click** - кліки по телефонах
- **email_click** - кліки по email
- **page_view** - перегляди сторінок

#### 📈 Налаштування конверсій:
1. Йдіть в **Налаштування** > **Події** 
2. Позначте як конверсії:
   - `form_submit` (основна конверсія)
   - `phone_click` (додаткова конверсія)

### 5. Налаштування аудиторій
Створіть аудиторії для ретаргетингу:
- Відвідувачі сторінки послуг
- Користувачі що заповнили форму
- Мобільні користувачі

### 6. Зв'язування з Google Ads (опціонально)
1. **Адміністрування** > **Зв'язування продуктів Google**
2. Зв'яжіть з Google Ads для кращого таргетингу

## 📊 Що відстежувати перші 30 днів

### КПІ для логістичного бізнесу:
- **Конверсія форм**: % заповнених заявок
- **Географія**: звідки найбільше клієнтів  
- **Пристрої**: мобільні vs десктоп
- **Джерела трафіку**: органічний пошук, реклама, соціальні мережі
- **Популярні сторінки**: які послуги цікавлять найбільше

### Тижневі звіти:
- Понеділок: Перегляд статистики тижня
- Середа: Аналіз конверсій 
- П'ятниця: Планування на наступний тиждень

## 🎯 Налаштування цілей

### Мікроконверсії:
- Перегляд сторінки "Про нас" > 2 хв
- Скачування файлів
- Перегляд 3+ сторінок за сесію

### Макроконверсії:
- Заповнення форми замовлення
- Дзвінок по телефону
- Заповнення форми зворотного зв'язку

## 🚨 ВАЖЛИВО!

1. **Тестування**: Після встановлення перевірте в **Режимі реального часу**
2. **GDPR**: Cookie banner вже налаштований
3. **Резервування**: Зробіть бекап налаштувань GA4
4. **Команда**: Надайте доступ менеджерам (Перегляд та аналіз)

## 📞 Підтримка
Якщо виникли питання:
- Документація Google Analytics: [support.google.com/analytics](https://support.google.com/analytics)
- YouTube канал Google Analytics
- Форуми Google Analytics Community

---
✅ **Після налаштування ваш сайт буде готовий до запуску з повним трекінгом!** 