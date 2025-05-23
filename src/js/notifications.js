// Notification System for Admin Panel
class NotificationSystem {
  constructor(adminPanel) {
    this.adminPanel = adminPanel;
    this.notifications = [];
    this.unreadCount = 0;
    this.soundEnabled = true;
    this.init();
  }

  init() {
    this.createNotificationUI();
    this.setupEventListeners();
    this.loadStoredNotifications();
    this.startPolling();
  }

  createNotificationUI() {
    const header = document.querySelector('.admin-header__user');
    if (!header) return;

    const notificationBell = document.createElement('div');
    notificationBell.className = 'notification-bell';
    notificationBell.innerHTML = `
      <button class="notification-bell__button" id="notificationBell">
        <i class="fas fa-bell"></i>
        <span class="notification-bell__badge" id="notificationBadge" style="display: none;">0</span>
      </button>
      
      <div class="notification-dropdown" id="notificationDropdown">
        <div class="notification-dropdown__header">
          <h3>Сповіщення</h3>
          <div class="notification-dropdown__actions">
            <button class="notification-action" id="markAllRead" title="Позначити всі як прочитані">
              <i class="fas fa-check-double"></i>
            </button>
            <button class="notification-action" id="notificationSettings" title="Налаштування">
              <i class="fas fa-cog"></i>
            </button>
          </div>
        </div>
        
        <div class="notification-filters">
          <button class="notification-filter active" data-filter="all">Всі</button>
          <button class="notification-filter" data-filter="unread">Непрочитані</button>
          <button class="notification-filter" data-filter="system">Системні</button>
          <button class="notification-filter" data-filter="requests">Заявки</button>
        </div>
        
        <div class="notification-list" id="notificationList">
          <div class="notification-empty">
            <i class="fas fa-bell-slash"></i>
            <p>Немає сповіщень</p>
          </div>
        </div>
        
        <div class="notification-dropdown__footer">
          <button class="notification-view-all">Переглянути всі сповіщення</button>
        </div>
      </div>
    `;

    header.insertBefore(notificationBell, header.firstChild);
  }

  setupEventListeners() {
    // Toggle dropdown
    document.getElementById('notificationBell')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.notification-bell')) {
        this.closeDropdown();
      }
    });

    // Filter notifications
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('notification-filter')) {
        this.filterNotifications(e.target.dataset.filter);
        
        // Update active filter
        document.querySelectorAll('.notification-filter').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      }
    });

    // Mark all as read
    document.getElementById('markAllRead')?.addEventListener('click', () => {
      this.markAllAsRead();
    });

    // Notification settings
    document.getElementById('notificationSettings')?.addEventListener('click', () => {
      this.showSettings();
    });
  }

  toggleDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    const bell = document.getElementById('notificationBell');
    
    if (dropdown && bell) {
      const isOpen = dropdown.classList.contains('active');
      
      if (isOpen) {
        this.closeDropdown();
      } else {
        dropdown.classList.add('active');
        bell.classList.add('active');
        this.renderNotifications();
      }
    }
  }

  closeDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    const bell = document.getElementById('notificationBell');
    
    if (dropdown && bell) {
      dropdown.classList.remove('active');
      bell.classList.remove('active');
    }
  }

  addNotification(notification) {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.updateUnreadCount();
    this.saveNotifications();
    this.renderNotifications();
    
    // Play sound if enabled
    if (this.soundEnabled && notification.type !== 'system') {
      this.playNotificationSound(notification.type);
    }

    // Show toast notification
    this.showToastNotification(newNotification);

    // Browser notification if supported
    this.showBrowserNotification(newNotification);
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.updateUnreadCount();
      this.saveNotifications();
      this.renderNotifications();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.updateUnreadCount();
    this.saveNotifications();
    this.renderNotifications();
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationBadge');
    
    if (badge) {
      if (this.unreadCount > 0) {
        badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  renderNotifications(filter = 'all') {
    const container = document.getElementById('notificationList');
    if (!container) return;

    let filteredNotifications = this.notifications;

    // Apply filter
    switch(filter) {
      case 'unread':
        filteredNotifications = this.notifications.filter(n => !n.read);
        break;
      case 'system':
        filteredNotifications = this.notifications.filter(n => n.type === 'system');
        break;
      case 'requests':
        filteredNotifications = this.notifications.filter(n => n.type === 'request');
        break;
    }

    if (filteredNotifications.length === 0) {
      container.innerHTML = `
        <div class="notification-empty">
          <i class="fas fa-bell-slash"></i>
          <p>Немає сповіщень</p>
        </div>
      `;
      return;
    }

    const notificationsHTML = filteredNotifications
      .slice(0, 10) // Show max 10 in dropdown
      .map(notification => this.createNotificationHTML(notification))
      .join('');

    container.innerHTML = notificationsHTML;

    // Add click listeners
    container.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.dataset.id);
        this.markAsRead(id);
        this.handleNotificationClick(id);
      });
    });
  }

  createNotificationHTML(notification) {
    const timeAgo = this.getTimeAgo(notification.timestamp);
    const iconClass = this.getNotificationIcon(notification.type);
    const typeClass = `notification-item--${notification.type}`;

    return `
      <div class="notification-item ${typeClass} ${!notification.read ? 'notification-item--unread' : ''}" 
           data-id="${notification.id}">
        <div class="notification-item__icon">
          <i class="${iconClass}"></i>
        </div>
        <div class="notification-item__content">
          <div class="notification-item__title">${notification.title}</div>
          <div class="notification-item__message">${notification.message}</div>
          <div class="notification-item__time">${timeAgo}</div>
        </div>
        ${!notification.read ? '<div class="notification-item__unread-dot"></div>' : ''}
      </div>
    `;
  }

  getNotificationIcon(type) {
    const icons = {
      'request': 'fas fa-clipboard-list',
      'system': 'fas fa-cog',
      'success': 'fas fa-check-circle',
      'warning': 'fas fa-exclamation-triangle',
      'error': 'fas fa-times-circle',
      'info': 'fas fa-info-circle'
    };
    return icons[type] || 'fas fa-bell';
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Щойно';
    if (minutes < 60) return `${minutes} хв тому`;
    if (hours < 24) return `${hours} год тому`;
    if (days < 7) return `${days} дн тому`;
    return new Date(timestamp).toLocaleDateString('uk-UA');
  }

  filterNotifications(filter) {
    this.renderNotifications(filter);
  }

  playNotificationSound(type) {
    const audio = new Audio();
    const soundUrls = {
      'request': './src/sounds/new-request.mp3',
      'success': './src/sounds/success.mp3',
      'warning': './src/sounds/warning.mp3',
      'error': './src/sounds/error.mp3'
    };

    audio.src = soundUrls[type] || './src/sounds/notification.mp3';
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Could not play notification sound:', e));
  }

  showToastNotification(notification) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${notification.type}`;
    toast.innerHTML = `
      <div class="toast__icon">
        <i class="${this.getNotificationIcon(notification.type)}"></i>
      </div>
      <div class="toast__content">
        <div class="toast__title">${notification.title}</div>
        <div class="toast__message">${notification.message}</div>
      </div>
      <button class="toast__close">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add to toast container
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    toastContainer.appendChild(toast);

    // Close button
    toast.querySelector('.toast__close').addEventListener('click', () => {
      this.removeToast(toast);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeToast(toast);
    }, 5000);

    // Animate in
    setTimeout(() => toast.classList.add('toast--show'), 10);
  }

  removeToast(toast) {
    toast.classList.remove('toast--show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  showBrowserNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: './src/img/fav.png',
        tag: notification.id
      });
    }
  }

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  handleNotificationClick(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (!notification) return;

    // Handle different notification actions
    if (notification.action) {
      switch(notification.action.type) {
        case 'viewRequest':
          this.adminPanel.viewRequest(notification.action.requestId);
          break;
        case 'navigate':
          window.location.href = notification.action.url;
          break;
        case 'openTab':
          // Open specific admin tab
          document.querySelector(`[data-tab="${notification.action.tab}"]`)?.click();
          break;
      }
    }

    this.closeDropdown();
  }

  showSettings() {
    const modal = this.adminPanel.createModal('small', 'Налаштування сповіщень', `
      <form id="notificationSettingsForm">
        <div class="form-group">
          <label>
            <input type="checkbox" ${this.soundEnabled ? 'checked' : ''}> 
            Звукові сповіщення
          </label>
        </div>
        
        <div class="form-group">
          <label>Типи сповіщень:</label>
          <div class="checkbox-group">
            <label><input type="checkbox" checked> Нові заявки</label>
            <label><input type="checkbox" checked> Системні повідомлення</label>
            <label><input type="checkbox" checked> Статус змінено</label>
            <label><input type="checkbox" checked> Помилки</label>
          </div>
        </div>

        <div class="form-group">
          <label>Браузерні сповіщення:</label>
          <button type="button" class="admin-button admin-button--secondary" onclick="notificationSystem.requestNotificationPermission()">
            Дозволити браузерні сповіщення
          </button>
        </div>
      </form>
    `, `
      <button class="admin-button admin-button--secondary" onclick="adminPanel.closeModal()">
        Скасувати
      </button>
      <button type="submit" form="notificationSettingsForm" class="admin-button admin-button--primary">
        Зберегти налаштування
      </button>
    `);

    this.adminPanel.showModal(modal);
  }

  startPolling() {
    // Poll for new notifications every 30 seconds
    setInterval(() => {
      this.checkForNewNotifications();
    }, 30000);
  }

  async checkForNewNotifications() {
    try {
      // In real app, this would be an API call
      // For demo, we'll simulate notifications
      if (Math.random() < 0.1) { // 10% chance
        this.simulateNewNotification();
      }
    } catch (error) {
      console.error('Error checking for notifications:', error);
    }
  }

  simulateNewNotification() {
    const types = ['request', 'system', 'success', 'warning'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const notifications = {
      request: {
        title: 'Нова заявка',
        message: 'Отримано нову заявку на перевезення',
        type: 'request',
        action: { type: 'openTab', tab: 'requests' }
      },
      system: {
        title: 'Системне оновлення',
        message: 'Система була оновлена до версії 2.1.0',
        type: 'system'
      },
      success: {
        title: 'Заявка схвалена',
        message: 'Заявка #1234 була успішно схвалена',
        type: 'success'
      },
      warning: {
        title: 'Попередження',
        message: 'Високе навантаження на сервер',
        type: 'warning'
      }
    };

    this.addNotification(notifications[type]);
  }

  saveNotifications() {
    // Keep only last 50 notifications
    const toSave = this.notifications.slice(0, 50);
    localStorage.setItem('adminNotifications', JSON.stringify(toSave));
  }

  loadStoredNotifications() {
    try {
      const stored = localStorage.getItem('adminNotifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
        this.updateUnreadCount();
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      this.notifications = [];
    }
  }

  // Public methods for adding different types of notifications
  addRequestNotification(requestId, title, message) {
    this.addNotification({
      title,
      message,
      type: 'request',
      action: { type: 'viewRequest', requestId }
    });
  }

  addSystemNotification(title, message) {
    this.addNotification({
      title,
      message,
      type: 'system'
    });
  }

  addSuccessNotification(title, message) {
    this.addNotification({
      title,
      message,
      type: 'success'
    });
  }

  addWarningNotification(title, message) {
    this.addNotification({
      title,
      message,
      type: 'warning'
    });
  }

  addErrorNotification(title, message) {
    this.addNotification({
      title,
      message,
      type: 'error'
    });
  }
}

// Initialize notification system
document.addEventListener('DOMContentLoaded', () => {
  if (window.adminPanel) {
    window.notificationSystem = new NotificationSystem(window.adminPanel);
    
    // Request browser notification permission
    window.notificationSystem.requestNotificationPermission();
    
    // Add some demo notifications
    setTimeout(() => {
      window.notificationSystem.addRequestNotification(
        1234, 
        'Нова заявка #1234', 
        'Перевезення Київ → Львів'
      );
    }, 3000);
  }
}); 