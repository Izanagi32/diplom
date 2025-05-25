# Налагодження форми редагування заявок

## Проблема
Форма редагування заявок не працює правильно:
- Кнопка "Далі" не переключає таби
- Форма не зберігається

## Виправлення

### 1. Оновлено JavaScript логіку
- Винесено JavaScript код з HTML шаблону в окремі методи
- Додано правильну ініціалізацію форми після створення модального вікна
- Покращено обробку подій для табів та форми

### 2. Додано налагоджувальні методи
Доступні в консолі браузера:
```javascript
// Тест форми редагування
testEditForm(1)

// Перевірка елементів форми
testFormElements()

// Тест API з'єднання
testAPI()
```

### 3. Створено тестову сторінку
Файл `test-edit-form.html` для тестування функціональності без повної адміністративної панелі.

## Як тестувати

### Варіант 1: Використання тестової сторінки
1. Відкрийте `test-edit-form.html` в браузері
2. Натисніть "Тест форми редагування"
3. Перевірте чи працюють таби та збереження

### Варіант 2: Використання повної адміністративної панелі
1. Відкрийте `admin-enhanced.html`
2. Перейдіть на вкладку "Заявки"
3. Натисніть кнопку "Редагувати" на будь-якій заявці
4. Перевірте функціональність

### Варіант 3: Консольне тестування
1. Відкрийте консоль браузера (F12)
2. Виконайте команди:
```javascript
// Тест форми
testEditForm(1)

// Через 2 секунди перевірте елементи
setTimeout(() => testFormElements(), 2000)
```

## Основні виправлення в коді

### 1. Функція `editRequest`
```javascript
async editRequest(id) {
  const request = this.currentData.find(item => item.id.toString() === id.toString());
  if (!request) {
    this.showToast('Заявку не знайдено', 'error');
    return;
  }

  const modal = this.createModal('edit', 'Редагування заявки', this.createEditForm(request));
  this.showModal(modal);
  
  // Ініціалізація форми після показу модального вікна
  setTimeout(() => {
    this.initializeEditForm(request.id);
  }, 100);
}
```

### 2. Функція `initializeEditForm`
```javascript
initializeEditForm(requestId) {
  console.log('Initializing edit form for request:', requestId);
  
  // Налаштування табів
  this.setupFormTabs();
  
  // Налаштування розрахунку об'єму
  this.setupVolumeCalculation();
  
  // Налаштування ADR перемикача
  this.setupAdrToggle();
  
  // Налаштування форматування телефону
  this.setupPhoneFormatting();
  
  // Налаштування відправки форми
  this.setupFormSubmission(requestId);
  
  console.log('Edit form initialized successfully');
}
```

### 3. Функція `setupFormTabs`
```javascript
setupFormTabs() {
  const tabs = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.tab-panel');
  const nextBtn = document.getElementById('nextTab');
  const prevBtn = document.getElementById('prevTab');
  let currentTab = 0;

  if (!tabs.length || !panels.length || !nextBtn || !prevBtn) {
    console.error('Tab elements not found');
    return;
  }

  const showTab = (index) => {
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });
    panels.forEach((panel, i) => {
      panel.classList.toggle('active', i === index);
    });
    
    prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
    nextBtn.style.display = index === tabs.length - 1 ? 'none' : 'inline-flex';
    currentTab = index;
  };

  // Обробники подій
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showTab(index));
  });

  nextBtn.addEventListener('click', () => {
    if (currentTab < tabs.length - 1) {
      showTab(currentTab + 1);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentTab > 0) {
      showTab(currentTab - 1);
    }
  });

  // Ініціалізація першого табу
  showTab(0);
}
```

## Можливі проблеми та рішення

### Проблема: Елементи форми не знайдені
**Рішення**: Перевірте чи правильно генерується HTML форми та чи викликається `initializeEditForm` після показу модального вікна.

### Проблема: Таби не переключаються
**Рішення**: Перевірте чи правильно додаються обробники подій до кнопок табів. Використайте `testFormElements()` для діагностики.

### Проблема: Форма не зберігається
**Рішення**: Перевірте валідацію даних та API з'єднання. Використайте `testAPI()` для перевірки.

### Проблема: Помилки в консолі
**Рішення**: Відкрийте консоль браузера та перевірте повідомлення про помилки. Використайте налагоджувальні методи для діагностики.

## Контрольний список

- [ ] Модальне вікно відкривається
- [ ] Всі поля форми заповнені правильними даними
- [ ] Кнопки табів працюють
- [ ] Кнопки "Далі" та "Назад" працюють
- [ ] Розрахунок об'єму працює
- [ ] ADR перемикач працює
- [ ] Форматування телефону працює
- [ ] Валідація форми працює
- [ ] Збереження форми працює
- [ ] API запити виконуються успішно

## Додаткова інформація

Якщо проблеми продовжуються, перевірте:
1. Чи правильно підключені CSS та JS файли
2. Чи немає конфліктів з іншими скриптами
3. Чи працює API сервер
4. Чи правильно налаштована база даних 