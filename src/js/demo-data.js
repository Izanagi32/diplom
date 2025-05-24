// ===== DEMO DATA FOR ENHANCED ADMIN PANEL =====

// Mock API responses for demonstration
window.DemoData = {
  // Sample requests data
  requests: [
    {
      id: 1001,
      status: 'pending',
      priority: 'high',
      pickupLocation: 'Київ',
      deliveryLocation: 'Варшава',
      pickupDate: '2024-01-20',
      length: 2.5,
      width: 1.8,
      height: 2.0,
      weight: 1500,
      quantity: 1,
      cargoType: 'Електроніка',
      adr: false,
      contactName: 'Іван Петренко',
      phone: '+380671234567',
      email: 'ivan@example.com',
      comment: 'Терміновий вантаж, потрібна особлива увага',
      createdAt: '2024-01-15T10:30:00Z',
      assignedTo: null
    },
    {
      id: 1002,
      status: 'approved',
      priority: 'medium',
      pickupLocation: 'Львів',
      deliveryLocation: 'Берлін',
      pickupDate: '2024-01-22',
      length: 4.0,
      width: 2.0,
      height: 2.5,
      weight: 3500,
      quantity: 2,
      cargoType: 'Будматеріали',
      adr: false,
      contactName: 'Марія Коваленко',
      phone: '+380502345678',
      email: 'maria@example.com',
      comment: '',
      createdAt: '2024-01-14T14:15:00Z',
      assignedTo: 'Олександр С.'
    },
    {
      id: 1003,
      status: 'in-progress',
      priority: 'urgent',
      pickupLocation: 'Одеса',
      deliveryLocation: 'Прага',
      pickupDate: '2024-01-18',
      length: 1.2,
      width: 0.8,
      height: 1.0,
      weight: 250,
      quantity: 5,
      cargoType: 'Фармацевтика',
      adr: true,
      adrClass: 'ADR 3',
      contactName: 'Сергій Мельник',
      phone: '+380931234567',
      email: 'sergiy@pharma.com',
      comment: 'Спеціальні умови зберігання: температура +2°C до +8°C',
      createdAt: '2024-01-12T09:45:00Z',
      assignedTo: 'Дмитро К.'
    },
    {
      id: 1004,
      status: 'completed',
      priority: 'low',
      pickupLocation: 'Харків',
      deliveryLocation: 'Будапешт',
      pickupDate: '2024-01-10',
      length: 3.0,
      width: 1.5,
      height: 1.8,
      weight: 800,
      quantity: 3,
      cargoType: 'Текстиль',
      adr: false,
      contactName: 'Ольга Сидоренко',
      phone: '+380671111111',
      email: 'olga@textile.ua',
      comment: 'Упаковка водостійка',
      createdAt: '2024-01-08T16:20:00Z',
      assignedTo: 'Ігор Л.'
    },
    {
      id: 1005,
      status: 'rejected',
      priority: 'medium',
      pickupLocation: 'Дніпро',
      deliveryLocation: 'Відень',
      pickupDate: '2024-01-25',
      length: 5.0,
      width: 2.5,
      height: 3.0,
      weight: 8000,
      quantity: 1,
      cargoType: 'Промислове обладнання',
      adr: false,
      contactName: 'Андрій Бондаренко',
      phone: '+380502222222',
      email: 'andriy@industry.com',
      comment: 'Перевищення габаритів',
      createdAt: '2024-01-07T11:10:00Z',
      assignedTo: null
    },
    {
      id: 1006,
      status: 'pending',
      priority: 'high',
      pickupLocation: 'Запоріжжя',
      deliveryLocation: 'Мюнхен',
      pickupDate: '2024-01-21',
      length: 2.0,
      width: 1.0,
      height: 1.5,
      weight: 650,
      quantity: 4,
      cargoType: 'Автозапчастини',
      adr: false,
      contactName: 'Віктор Гриценко',
      phone: '+380673333333',
      email: 'viktor@autoparts.ua',
      comment: 'Оригінальні запчастини BMW',
      createdAt: '2024-01-16T13:30:00Z',
      assignedTo: null
    },
    {
      id: 1007,
      status: 'approved',
      priority: 'medium',
      pickupLocation: 'Полтава',
      deliveryLocation: 'Франкфурт',
      pickupDate: '2024-01-23',
      length: 1.5,
      width: 1.2,
      height: 0.8,
      weight: 180,
      quantity: 10,
      cargoType: 'Документи',
      adr: false,
      contactName: 'Тетяна Шевченко',
      phone: '+380504444444',
      email: 'tetyana@docs.com',
      comment: 'Конфіденційні документи, особливі умови безпеки',
      createdAt: '2024-01-13T08:15:00Z',
      assignedTo: 'Микола В.'
    },
    {
      id: 1008,
      status: 'in-progress',
      priority: 'urgent',
      pickupLocation: 'Вінниця',
      deliveryLocation: 'Цюрих',
      pickupDate: '2024-01-19',
      length: 0.6,
      width: 0.4,
      height: 0.3,
      weight: 15,
      quantity: 1,
      cargoType: 'Ювелірні вироби',
      adr: false,
      contactName: 'Роман Ткаченко',
      phone: '+380935555555',
      email: 'roman@jewelry.ua',
      comment: 'Високоцінний вантаж, потрібна охорона',
      createdAt: '2024-01-11T15:45:00Z',
      assignedTo: 'Володимир П.'
    }
  ],

  // Activity log data
  activities: [
    {
      id: 1,
      timestamp: '2024-01-16T14:30:00Z',
      user: 'Адміністратор',
      action: 'Створено заявку',
      object: 'Заявка #1006',
      status: 'success'
    },
    {
      id: 2,
      timestamp: '2024-01-16T13:15:00Z',
      user: 'Менеджер Олена',
      action: 'Змінено статус',
      object: 'Заявка #1003',
      status: 'info'
    },
    {
      id: 3,
      timestamp: '2024-01-16T12:45:00Z',
      user: 'Диспетчер Михайло',
      action: 'Призначено водія',
      object: 'Заявка #1002',
      status: 'success'
    },
    {
      id: 4,
      timestamp: '2024-01-16T11:20:00Z',
      user: 'Система',
      action: 'Автоматичне нагадування',
      object: 'Заявка #1001',
      status: 'warning'
    },
    {
      id: 5,
      timestamp: '2024-01-16T10:10:00Z',
      user: 'Адміністратор',
      action: 'Відхилено заявку',
      object: 'Заявка #1005',
      status: 'error'
    }
  ],

  // User notifications
  notifications: [
    {
      id: 1,
      type: 'info',
      title: 'Нова заявка',
      message: 'Отримано нову заявку #1006 від клієнта Віктор Гриценко',
      time: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Затримка доставки',
      message: 'Можлива затримка доставки заявки #1003 через погодні умови',
      time: new Date(Date.now() - 15 * 60 * 1000),
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Завершено перевезення',
      message: 'Заявка #1004 успішно доставлена до Будапешта',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true
    },
    {
      id: 4,
      type: 'error',
      title: 'Технічна проблема',
      message: 'Виявлено проблему з GPS трекером на транспорті №UA1234AB',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true
    }
  ],

  // Statistics data
  stats: {
    total: 8,
    completed: 1,
    pending: 2,
    approved: 2,
    inProgress: 2,
    rejected: 1,
    urgent: 2,
    todayNew: 1,
    completionRate: 75,
    avgWaitTime: '2.5г'
  }
};

// Mock API implementation
window.MockAPI = {
  // Get all requests
  async getRequests() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      ok: true,
      json: async () => window.DemoData.requests
    };
  },

  // Get request by ID
  async getRequest(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const request = window.DemoData.requests.find(r => r.id === parseInt(id));
    return {
      ok: !!request,
      json: async () => request
    };
  },

  // Update request
  async updateRequest(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = window.DemoData.requests.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      window.DemoData.requests[index] = { 
        ...window.DemoData.requests[index], 
        ...updates 
      };
      return { ok: true };
    }
    return { ok: false };
  },

  // Delete request
  async deleteRequest(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = window.DemoData.requests.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      window.DemoData.requests.splice(index, 1);
      return { ok: true };
    }
    return { ok: false };
  },

  // Get activities
  async getActivities() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      ok: true,
      json: async () => window.DemoData.activities
    };
  },

  // Get notifications
  async getNotifications() {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      ok: true,
      json: async () => window.DemoData.notifications
    };
  }
};

// Override fetch for demo mode
if (localStorage.getItem('admin_demo_mode') === 'true') {
  const originalFetch = window.fetch;
  
  window.fetch = async function(url, options) {
    // Check if it's an API call
    if (url.includes('/api/')) {
      console.log('🎭 Demo mode: Intercepting API call:', url, options);
      
      // Route to appropriate mock API method
      if (url.includes('/api/requests')) {
        if (options?.method === 'POST') {
          // Create new request
          const body = JSON.parse(options.body);
          const newRequest = {
            id: Math.max(...window.DemoData.requests.map(r => r.id)) + 1,
            ...body,
            createdAt: new Date().toISOString(),
            status: 'pending'
          };
          window.DemoData.requests.unshift(newRequest);
          return { ok: true, json: async () => newRequest };
        } else if (options?.method === 'PUT') {
          // Update request
          const id = url.split('/').pop();
          const body = JSON.parse(options.body);
          return window.MockAPI.updateRequest(id, body);
        } else if (options?.method === 'DELETE') {
          // Delete request
          const id = url.split('/').pop();
          return window.MockAPI.deleteRequest(id);
        } else {
          // Get requests
          return window.MockAPI.getRequests();
        }
      }
      
      if (url.includes('/api/activities')) {
        return window.MockAPI.getActivities();
      }
      
      if (url.includes('/api/notifications')) {
        return window.MockAPI.getNotifications();
      }
    }
    
    // If it's not an API call, use original fetch
    return originalFetch.apply(this, arguments);
  };
  
  console.log('🎭 Demo mode activated! API calls will use mock data.');
}

// Enable demo mode by default for this enhanced admin panel
localStorage.setItem('admin_demo_mode', 'true');

// Demo utilities
window.DemoUtils = {
  // Add random request
  addRandomRequest() {
    const cities = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Запоріжжя'];
    const europeanCities = ['Варшава', 'Берлін', 'Прага', 'Відень', 'Будапешт', 'Мюнхен'];
    const cargoTypes = ['Електроніка', 'Будматеріали', 'Текстиль', 'Автозапчастини', 'Продукти'];
    const statuses = ['pending', 'approved', 'in-progress'];
    const priorities = ['low', 'medium', 'high', 'urgent'];
    
    const newId = Math.max(...window.DemoData.requests.map(r => r.id)) + 1;
    const pickup = cities[Math.floor(Math.random() * cities.length)];
    const delivery = europeanCities[Math.floor(Math.random() * europeanCities.length)];
    
    const newRequest = {
      id: newId,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      pickupLocation: pickup,
      deliveryLocation: delivery,
      pickupDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      length: (Math.random() * 4 + 1).toFixed(1),
      width: (Math.random() * 2 + 0.5).toFixed(1),
      height: (Math.random() * 2.5 + 0.8).toFixed(1),
      weight: Math.floor(Math.random() * 5000 + 100),
      quantity: Math.floor(Math.random() * 10 + 1),
      cargoType: cargoTypes[Math.floor(Math.random() * cargoTypes.length)],
      adr: Math.random() > 0.8,
      contactName: `Клієнт ${newId}`,
      phone: `+380${Math.floor(Math.random() * 900000000 + 100000000)}`,
      email: `client${newId}@example.com`,
      comment: Math.random() > 0.5 ? 'Стандартна доставка' : '',
      createdAt: new Date().toISOString(),
      assignedTo: null
    };
    
    window.DemoData.requests.unshift(newRequest);
    return newRequest;
  },

  // Simulate real-time updates
  startRealTimeSimulation() {
    setInterval(() => {
      // Randomly update status of some requests
      const pendingRequests = window.DemoData.requests.filter(r => r.status === 'pending');
      if (pendingRequests.length > 0 && Math.random() > 0.7) {
        const randomRequest = pendingRequests[Math.floor(Math.random() * pendingRequests.length)];
        randomRequest.status = 'approved';
        randomRequest.assignedTo = 'Автоматично призначено';
        
        console.log('🔄 Real-time update: Request', randomRequest.id, 'approved');
        
        // Trigger refresh if admin panel is loaded
        if (window.adminPanel) {
          window.adminPanel.loadRequests();
        }
      }
      
      // Add random request occasionally
      if (Math.random() > 0.95) {
        this.addRandomRequest();
        console.log('📝 Real-time update: New request added');
        
        if (window.adminPanel) {
          window.adminPanel.loadRequests();
        }
      }
    }, 10000); // Every 10 seconds
  },

  // Reset to initial state
  resetData() {
    localStorage.removeItem('admin_demo_mode');
    location.reload();
  }
};

// Auto-start real-time simulation
setTimeout(() => {
  if (localStorage.getItem('admin_demo_mode') === 'true') {
    window.DemoUtils.startRealTimeSimulation();
    console.log('🔄 Real-time simulation started');
  }
}, 5000);

console.log('📊 Demo data loaded with', window.DemoData.requests.length, 'sample requests'); 