// ===== ENHANCED ADMIN PANEL APPLICATION =====

class EnhancedAdminPanel {
  constructor() {
    // Core properties
    this.currentData = [];
    this.filteredData = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalPages = 0;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.activeTab = 'dashboard';
    this.selectedItems = new Set();
    
    // Filter state
    this.filters = {
      status: '',
      priority: '',
      dateFrom: '',
      dateTo: '',
      route: '',
      client: '',
      search: ''
    };
    
    // UI state
    this.isLoading = false;
    this.isMobileMenuOpen = false;
    this.notifications = [];
    
    this.init();
  }

  async init() {
    try {
      // Check authentication
      if (!this.checkAuthentication()) {
        window.location.href = './admin-login.html';
        return;
      }
      
      // Initialize UI components
      this.setupEventListeners();
      this.setupLogout();
      this.setupTabNavigation();
      this.setupMobileMenu();
      this.setupNotifications();
      
      // Load initial data
      await this.loadRequests();
      this.renderStats();
      this.renderActivityLog();
      
      // Setup real-time updates
      this.setupRealTimeUpdates();
      
      // Expose debug methods in development
      this.exposeDebugMethods();
      
      console.log('Enhanced Admin Panel initialized successfully');
    } catch (error) {
      console.error('Error initializing admin panel:', error);
      this.showError('Помилка ініціалізації панелі: ' + error.message);
    }
  }

  // ===== AUTHENTICATION =====
  checkAuthentication() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const isSessionLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
      const loginTime = localStorage.getItem('adminLoginTime');
      const now = Date.now();
      const loginTimeValue = parseInt(loginTime, 10);
      const expirationTime = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (now - loginTimeValue < expirationTime) {
        return true;
      } else {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminLoginTime');
        return false;
      }
    }
    
    return isSessionLoggedIn;
  }

  setupLogout() {
    // Add logout button to user dropdown or header
    const userElement = document.querySelector('.admin-header__user');
    if (userElement) {
      userElement.addEventListener('click', () => {
        this.showUserMenu();
      });
    }
  }

  showUserMenu() {
    const userDropdown = this.createUserDropdown();
    document.body.appendChild(userDropdown);
    
    // Position dropdown
    const userElement = document.querySelector('.admin-header__user');
    const rect = userElement.getBoundingClientRect();
    userDropdown.style.top = `${rect.bottom + 8}px`;
    userDropdown.style.right = `${window.innerWidth - rect.right}px`;
    
    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target)) {
          userDropdown.remove();
        }
      }, { once: true });
    }, 100);
  }

  createUserDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
      <div class="user-dropdown__item">
        <i class="fas fa-user"></i>
        <span>Профіль</span>
      </div>
      <div class="user-dropdown__item">
        <i class="fas fa-cog"></i>
        <span>Налаштування</span>
      </div>
      <div class="user-dropdown__divider"></div>
      <div class="user-dropdown__item" id="logoutBtn">
        <i class="fas fa-sign-out-alt"></i>
        <span>Вийти</span>
      </div>
    `;
    
    dropdown.querySelector('#logoutBtn').addEventListener('click', () => {
      this.logout();
    });
    
    return dropdown;
  }

  logout() {
    if (confirm('Ви впевнені, що хочете вийти?')) {
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminLoginTime');
      sessionStorage.removeItem('adminLoggedIn');
      window.location.href = './admin-login.html';
    }
  }

  // ===== EVENT LISTENERS =====
  setupEventListeners() {
    // Search functionality
    this.setupSearchListeners();
    
    // Filter functionality
    this.setupFilterListeners();
    
    // Table functionality
    this.setupTableListeners();
    
    // Bulk actions
    this.setupBulkActions();
    
    // Global actions
    this.setupGlobalActions();
  }

  setupSearchListeners() {
    // Global search
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
      let searchTimeout;
      globalSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.performGlobalSearch(e.target.value);
        }, 300);
      });
    }

    // Table search
    const searchRequests = document.getElementById('searchRequests');
    if (searchRequests) {
      let searchTimeout;
      searchRequests.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.filters.search = e.target.value;
          this.applyFilters();
        }, 300);
      });
    }
  }

  setupFilterListeners() {
    const filterElements = [
      'statusFilter',
      'priorityFilter', 
      'dateFromFilter',
      'dateToFilter',
      'routeFilter',
      'clientFilter'
    ];

    filterElements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', () => {
          const filterKey = id.replace('Filter', '').replace('dateFrom', 'dateFrom').replace('dateTo', 'dateTo');
          this.filters[filterKey] = element.value;
          this.applyFilters();
        });
      }
    });

    // Filter panel toggle
    const toggleFilters = document.getElementById('toggleFilters');
    if (toggleFilters) {
      toggleFilters.addEventListener('click', () => {
        this.toggleFiltersPanel();
      });
    }

    // Filter actions
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
      clearFilters.addEventListener('click', () => {
        this.clearFilters();
      });
    }

    const applyFilters = document.getElementById('applyFilters');
    if (applyFilters) {
      applyFilters.addEventListener('click', () => {
        this.applyFilters();
      });
    }
  }

  setupTableListeners() {
    // Items per page
    const itemsPerPage = document.getElementById('itemsPerPage');
    if (itemsPerPage) {
      itemsPerPage.addEventListener('change', (e) => {
        this.itemsPerPage = parseInt(e.target.value);
        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
      });
    }

    // Column sorting
    document.addEventListener('click', (e) => {
      if (e.target.closest('.sortable')) {
        const header = e.target.closest('.sortable');
        const column = header.dataset.column;
        this.sortData(column);
      }
    });

    // Row selection
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('row-checkbox')) {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          this.selectedItems.add(id);
        } else {
          this.selectedItems.delete(id);
        }
        this.updateBulkActions();
      }
    });

    // Select all
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
      selectAll.addEventListener('change', (e) => {
        this.selectAllItems(e.target.checked);
      });
    }
  }

  setupBulkActions() {
    const bulkStatusChange = document.getElementById('bulkStatusChange');
    if (bulkStatusChange) {
      bulkStatusChange.addEventListener('click', () => {
        this.showBulkStatusModal();
      });
    }

    const bulkAssign = document.getElementById('bulkAssign');
    if (bulkAssign) {
      bulkAssign.addEventListener('click', () => {
        this.showBulkAssignModal();
      });
    }

    const bulkDelete = document.getElementById('bulkDelete');
    if (bulkDelete) {
      bulkDelete.addEventListener('click', () => {
        this.confirmBulkDelete();
      });
    }
  }

  setupGlobalActions() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.refreshData();
      });
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportData();
      });
    }

    // Add request button
    const addRequestBtn = document.getElementById('addRequestBtn');
    if (addRequestBtn) {
      addRequestBtn.addEventListener('click', () => {
        this.showAddRequestModal();
      });
    }

    // Columns button
    const columnsBtn = document.getElementById('columnsBtn');
    if (columnsBtn) {
      columnsBtn.addEventListener('click', () => {
        this.showColumnsModal();
      });
    }

    // Retry button
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.loadRequests();
      });
    }
  }

  // ===== TAB NAVIGATION =====
  setupTabNavigation() {
    document.addEventListener('click', (e) => {
      const tabLink = e.target.closest('[data-tab]');
      if (tabLink && tabLink.dataset.tab) {
        e.preventDefault();
        this.switchTab(tabLink.dataset.tab);
      }
    });
  }

  switchTab(tabName) {
    // Update active sidebar item
    document.querySelectorAll('.admin-sidebar__nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`[data-tab="${tabName}"]`)?.closest('.admin-sidebar__nav-item');
    if (activeItem) {
      activeItem.classList.add('active');
    }

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    const activeContent = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
    if (activeContent) {
      activeContent.classList.add('active');
    }

    // Update page title and breadcrumb
    this.updatePageHeader(tabName);
    
    // Load tab-specific data
    this.loadTabData(tabName);
    
    this.activeTab = tabName;
  }

  updatePageHeader(tabName) {
    const titles = {
      dashboard: 'Дашборд',
      requests: 'Заявки',
      shipments: 'Перевезення',
      clients: 'Клієнти',
      analytics: 'Аналітика',
      settings: 'Налаштування'
    };

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
      pageTitle.textContent = titles[tabName] || 'Адмін панель';
    }

    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <a href="#" data-tab="dashboard">Головна</a>
        <span class="separator">/</span>
        <span>${titles[tabName] || 'Сторінка'}</span>
      `;
    }
  }

  async loadTabData(tabName) {
    switch (tabName) {
      case 'dashboard':
        await this.loadDashboardData();
        break;
      case 'requests':
        await this.loadRequests();
        break;
      case 'shipments':
        // Load shipments data
        break;
      case 'clients':
        // Load clients data
        break;
      case 'analytics':
        // Load analytics data
        break;
      case 'settings':
        // Load settings data
        break;
    }
  }

  async loadDashboardData() {
    try {
      this.renderStats();
      this.renderActivityLog();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  // ===== MOBILE MENU =====
  setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('adminSidebar');

    if (mobileMenuToggle && sidebar) {
      mobileMenuToggle.addEventListener('click', () => {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        sidebar.classList.toggle('open', this.isMobileMenuOpen);
        
        // Update icon
        const icon = mobileMenuToggle.querySelector('i');
        icon.className = this.isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (this.isMobileMenuOpen && 
            !sidebar.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
          this.isMobileMenuOpen = false;
          sidebar.classList.remove('open');
          mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        }
      });
    }
  }

  // ===== NOTIFICATIONS =====
  setupNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', () => {
        this.showNotifications();
      });
    }

    // Load notifications
    this.loadNotifications();
  }

  async loadNotifications() {
    try {
      // Simulate loading notifications
      this.notifications = [
        {
          id: 1,
          type: 'info',
          title: 'Нова заявка',
          message: 'Отримано нову заявку на перевезення',
          time: new Date(Date.now() - 5 * 60 * 1000),
          read: false
        },
        {
          id: 2,
          type: 'success',
          title: 'Завершено перевезення',
          message: 'Перевезення #123 успішно завершено',
          time: new Date(Date.now() - 30 * 60 * 1000),
          read: false
        }
      ];

      this.updateNotificationBadge();
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    const unreadCount = this.notifications.filter(n => !n.read).length;
    
    if (badge) {
      if (unreadCount > 0) {
        badge.style.display = 'block';
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
      } else {
        badge.style.display = 'none';
      }
    }
  }

  showNotifications() {
    const dropdown = this.createNotificationsDropdown();
    document.body.appendChild(dropdown);
    
    // Position dropdown
    const notificationBtn = document.getElementById('notificationBtn');
    const rect = notificationBtn.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + 8}px`;
    dropdown.style.right = `${window.innerWidth - rect.right}px`;
    
    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.remove();
        }
      }, { once: true });
    }, 100);
  }

  createNotificationsDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'notifications-dropdown';
    
    const header = document.createElement('div');
    header.className = 'notifications-dropdown__header';
    header.innerHTML = `
      <h4>Сповіщення</h4>
      <button class="mark-all-read">Позначити всі як прочитані</button>
    `;
    
    const list = document.createElement('div');
    list.className = 'notifications-dropdown__list';
    
    if (this.notifications.length === 0) {
      list.innerHTML = '<div class="no-notifications">Немає сповіщень</div>';
    } else {
      this.notifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = `notification-item ${!notification.read ? 'unread' : ''}`;
        item.innerHTML = `
          <div class="notification-icon notification-icon--${notification.type}">
            <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
          </div>
          <div class="notification-content">
            <h5>${notification.title}</h5>
            <p>${notification.message}</p>
            <span class="notification-time">${this.formatRelativeTime(notification.time)}</span>
          </div>
        `;
        list.appendChild(item);
      });
    }
    
    dropdown.appendChild(header);
    dropdown.appendChild(list);
    
    // Mark all as read functionality
    header.querySelector('.mark-all-read').addEventListener('click', () => {
      this.markAllNotificationsAsRead();
      dropdown.remove();
    });
    
    return dropdown;
  }

  getNotificationIcon(type) {
    const icons = {
      info: 'info-circle',
      success: 'check-circle',
      warning: 'exclamation-triangle',
      error: 'times-circle'
    };
    return icons[type] || 'info-circle';
  }

  markAllNotificationsAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.updateNotificationBadge();
  }

  // ===== DATA LOADING =====
  async loadRequests() {
    try {
      this.showLoading();
      
      // Use real API endpoint - remove demo mode
      const response = await fetch('/api/requests');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      // Enhance data with additional fields for admin panel
      this.currentData = data.map(item => ({
        ...item,
        status: item.status || 'pending',
        priority: this.determinePriority(item),
        assignedTo: item.assignedTo || null,
        route: `${item.pickupLocation} → ${item.deliveryLocation}`,
        client: item.contactName || 'Невідомо'
      }));
      
      this.filteredData = [...this.currentData];
      this.renderTable();
      this.renderPagination();
      this.updateRequestsBadge();
      this.hideError();
      
    } catch (error) {
      console.error('Error loading requests:', error);
      this.showError('Помилка завантаження заявок: ' + error.message);
    } finally {
      this.hideLoading();
    }
  }

  // Helper method to determine priority based on cargo type and other factors
  determinePriority(request) {
    if (request.adr) return 'high'; // ADR cargo is always high priority
    if (request.cargoType?.toLowerCase().includes('фарма') || 
        request.cargoType?.toLowerCase().includes('медич')) return 'urgent';
    if (request.weight > 5000) return 'high';
    if (request.comment?.toLowerCase().includes('терміново') || 
        request.comment?.toLowerCase().includes('urgent')) return 'urgent';
    return 'medium';
  }

  // ===== FILTERING AND SORTING =====
  applyFilters() {
    this.filteredData = this.currentData.filter(item => {
      // Status filter
      if (this.filters.status && item.status !== this.filters.status) {
        return false;
      }
      
      // Priority filter
      if (this.filters.priority && item.priority !== this.filters.priority) {
        return false;
      }
      
      // Date range filter
      if (this.filters.dateFrom) {
        const itemDate = new Date(item.pickupDate);
        const filterDate = new Date(this.filters.dateFrom);
        if (itemDate < filterDate) return false;
      }
      
      if (this.filters.dateTo) {
        const itemDate = new Date(item.pickupDate);
        const filterDate = new Date(this.filters.dateTo);
        if (itemDate > filterDate) return false;
      }
      
      // Route filter
      if (this.filters.route) {
        const routeText = `${item.pickupLocation} ${item.deliveryLocation}`.toLowerCase();
        if (!routeText.includes(this.filters.route.toLowerCase())) {
          return false;
        }
      }
      
      // Client filter
      if (this.filters.client) {
        const clientText = `${item.contactName} ${item.phone} ${item.email}`.toLowerCase();
        if (!clientText.includes(this.filters.client.toLowerCase())) {
          return false;
        }
      }
      
      // Search filter
      if (this.filters.search) {
        const searchText = Object.values(item).join(' ').toLowerCase();
        if (!searchText.includes(this.filters.search.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    });

    this.currentPage = 1;
    this.renderTable();
    this.renderPagination();
  }

  sortData(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      // Handle different data types
      if (column === 'id') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      } else if (column.includes('Date') || column.includes('At')) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.updateSortHeaders();
    this.renderTable();
  }

  updateSortHeaders() {
    document.querySelectorAll('.sortable').forEach(header => {
      const icon = header.querySelector('.sort-icon');
      header.classList.remove('sorted-asc', 'sorted-desc');
      
      if (header.dataset.column === this.sortColumn) {
        header.classList.add(`sorted-${this.sortDirection === 'asc' ? 'up' : 'down'}`);
        icon.className = `fas fa-sort-${this.sortDirection === 'asc' ? 'up' : 'down'} sort-icon`;
      } else {
        icon.className = 'fas fa-sort sort-icon';
      }
    });
  }

  clearFilters() {
    // Reset filter values
    Object.keys(this.filters).forEach(key => {
      this.filters[key] = '';
    });

    // Reset form inputs
    document.querySelectorAll('#filtersGrid input, #filtersGrid select').forEach(input => {
      input.value = '';
    });

    // Apply filters
    this.applyFilters();
    this.showToast('Фільтри очищено', 'info');
  }

  toggleFiltersPanel() {
    const panel = document.getElementById('filtersGrid');
    const button = document.getElementById('toggleFilters');
    
    if (panel && button) {
      const isHidden = panel.style.display === 'none';
      panel.style.display = isHidden ? 'grid' : 'none';
      
      const icon = button.querySelector('i');
      const text = button.querySelector('span') || button.childNodes[button.childNodes.length - 1];
      
      if (isHidden) {
        icon.className = 'fas fa-chevron-up';
        if (text.textContent) text.textContent = 'Приховати';
      } else {
        icon.className = 'fas fa-chevron-down';
        if (text.textContent) text.textContent = 'Показати';
      }
    }
  }

  // ===== RENDERING =====
  renderStats() {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;

    const stats = this.calculateStats();
    
    statsGrid.innerHTML = `
      <div class="stat-card stat-card--primary">
        <div class="stat-card__header">
          <div class="stat-card__title">Всього заявок</div>
          <div class="stat-card__icon">
            <i class="fas fa-clipboard-list"></i>
          </div>
        </div>
        <div class="stat-card__value">${stats.total}</div>
        <div class="stat-card__change stat-card__change--positive">
          <i class="fas fa-arrow-up change-icon"></i>
          +${stats.todayNew} сьогодні
        </div>
        <div class="stat-card__footer">
          Оновлено щойно
        </div>
      </div>

      <div class="stat-card stat-card--success">
        <div class="stat-card__header">
          <div class="stat-card__title">Завершені</div>
          <div class="stat-card__icon">
            <i class="fas fa-check-circle"></i>
          </div>
        </div>
        <div class="stat-card__value">${stats.completed}</div>
        <div class="stat-card__change stat-card__change--positive">
          <i class="fas fa-arrow-up change-icon"></i>
          ${stats.completionRate}% rate
        </div>
        <div class="stat-card__footer">
          За останній місяць
        </div>
      </div>

      <div class="stat-card stat-card--warning">
        <div class="stat-card__header">
          <div class="stat-card__title">В очікуванні</div>
          <div class="stat-card__icon">
            <i class="fas fa-hourglass-half"></i>
          </div>
        </div>
        <div class="stat-card__value">${stats.pending}</div>
        <div class="stat-card__change stat-card__change--neutral">
          <i class="fas fa-minus change-icon"></i>
          ${stats.avgWaitTime} сер. час
        </div>
        <div class="stat-card__footer">
          Потребують уваги
        </div>
      </div>

      <div class="stat-card stat-card--error">
        <div class="stat-card__header">
          <div class="stat-card__title">Термінові</div>
          <div class="stat-card__icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
        </div>
        <div class="stat-card__value">${stats.urgent}</div>
        <div class="stat-card__change stat-card__change--negative">
          <i class="fas fa-arrow-up change-icon"></i>
          Потребують негайної дії
        </div>
        <div class="stat-card__footer">
          Критичний пріоритет
        </div>
      </div>
    `;
  }

  calculateStats() {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const total = this.currentData.length;
    const completed = this.currentData.filter(item => item.status === 'completed').length;
    const pending = this.currentData.filter(item => item.status === 'pending').length;
    const urgent = this.currentData.filter(item => item.priority === 'urgent').length;
    const todayNew = this.currentData.filter(item => 
      new Date(item.createdAt) >= todayStart
    ).length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const avgWaitTime = '2.5г'; // This would be calculated from actual data
    
    return {
      total,
      completed,
      pending,
      urgent,
      todayNew,
      completionRate,
      avgWaitTime
    };
  }

  renderTable() {
    const tbody = document.getElementById('requestsTableBody');
    if (!tbody) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageData = this.filteredData.slice(startIndex, endIndex);

    if (pageData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="12" class="empty-state">
            <div class="empty-state__icon">
              <i class="fas fa-search"></i>
            </div>
            <div class="empty-state__message">
              ${this.filters.search || Object.values(this.filters).some(f => f) 
                ? 'Не знайдено записів, які відповідають фільтрам' 
                : 'Немає заявок для відображення'}
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = pageData.map(item => this.createTableRow(item)).join('');
  }

  createTableRow(item) {
    const isSelected = this.selectedItems.has(item.id.toString());
    
    return `
      <tr class="${isSelected ? 'selected' : ''}" data-id="${item.id}">
        <td class="checkbox-cell">
          <input type="checkbox" class="row-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''}>
        </td>
        <td class="id-cell">
          <strong>#${item.id}</strong>
        </td>
        <td>
          ${this.createPriorityBadge(item.priority)}
        </td>
        <td class="route-cell">
          <div class="route-info">
            <div class="route-from">${item.pickupLocation}</div>
            <div class="route-arrow">→</div>
            <div class="route-to">${item.deliveryLocation}</div>
          </div>
        </td>
        <td class="dimensions-cell">
          <span class="dimensions">
            ${item.length}×${item.width}×${item.height}м
          </span>
        </td>
        <td class="weight-quantity-cell">
          <div class="weight-quantity">
            <div>${item.weight}кг</div>
            <div class="quantity">${item.quantity}шт</div>
          </div>
        </td>
        <td class="cargo-type-cell">
          <div class="cargo-info">
            <span class="cargo-type">${item.cargoType}</span>
            ${item.adr ? '<span class="adr-badge">ADR</span>' : ''}
          </div>
        </td>
        <td class="date-cell">
          ${this.formatDate(item.pickupDate)}
        </td>
        <td class="client-cell">
          <div class="client-info">
            <div class="client-name">${item.contactName}</div>
            <div class="client-phone">${item.phone}</div>
          </div>
        </td>
        <td>
          ${this.createStatusBadge(item.status)}
        </td>
        <td class="created-cell">
          ${this.formatDateTime(item.createdAt)}
        </td>
        <td class="actions">
          <div class="action-buttons">
            <button class="btn btn--sm btn--ghost" onclick="adminPanel.viewRequest('${item.id}')" title="Переглянути">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn--sm btn--ghost" onclick="adminPanel.editRequest('${item.id}')" title="Редагувати">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn--sm btn--ghost" onclick="adminPanel.changeStatus('${item.id}')" title="Змінити статус">
              <i class="fas fa-exchange-alt"></i>
            </button>
            <button class="btn btn--sm btn--error" onclick="adminPanel.deleteRequest('${item.id}')" title="Видалити">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  createStatusBadge(status) {
    const statusMap = {
      pending: { text: 'Очікування', class: 'pending' },
      approved: { text: 'Схвалено', class: 'approved' },
      rejected: { text: 'Відхилено', class: 'rejected' },
      'in-progress': { text: 'В процесі', class: 'in-progress' },
      completed: { text: 'Завершено', class: 'completed' }
    };

    const statusInfo = statusMap[status] || { text: status, class: 'default' };
    
    return `
      <div class="status-badge status-badge--${statusInfo.class}">
        <span class="status-icon"></span>
        ${statusInfo.text}
      </div>
    `;
  }

  createPriorityBadge(priority) {
    const priorityMap = {
      low: { text: 'Низький', class: 'low', icon: 'fa-arrow-down' },
      medium: { text: 'Середній', class: 'medium', icon: 'fa-minus' },
      high: { text: 'Високий', class: 'high', icon: 'fa-arrow-up' },
      urgent: { text: 'Терміновий', class: 'urgent', icon: 'fa-exclamation' }
    };

    const priorityInfo = priorityMap[priority] || { text: priority, class: 'medium', icon: 'fa-minus' };
    
    return `
      <div class="priority-badge priority-badge--${priorityInfo.class}">
        <i class="fas ${priorityInfo.icon}"></i>
        ${priorityInfo.text}
      </div>
    `;
  }

  renderPagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    
    const paginationInfo = document.getElementById('paginationInfo');
    const paginationControls = document.getElementById('paginationControls');
    
    if (!paginationInfo || !paginationControls) return;

    // Update info
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredData.length);
    
    paginationInfo.textContent = `Показано ${startItem}-${endItem} з ${this.filteredData.length} записів`;

    // Generate pagination controls
    const controls = [];
    
    // Previous button
    controls.push(`
      <button class="page-btn" ${this.currentPage <= 1 ? 'disabled' : ''} 
              onclick="adminPanel.goToPage(${this.currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
      </button>
    `);

    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      controls.push(`<button class="page-btn" onclick="adminPanel.goToPage(1)">1</button>`);
      if (startPage > 2) {
        controls.push(`<span class="page-separator">...</span>`);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      controls.push(`
        <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                onclick="adminPanel.goToPage(${i})">
          ${i}
        </button>
      `);
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        controls.push(`<span class="page-separator">...</span>`);
      }
      controls.push(`<button class="page-btn" onclick="adminPanel.goToPage(${this.totalPages})">${this.totalPages}</button>`);
    }

    // Next button
    controls.push(`
      <button class="page-btn" ${this.currentPage >= this.totalPages ? 'disabled' : ''} 
              onclick="adminPanel.goToPage(${this.currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
      </button>
    `);

    paginationControls.innerHTML = controls.join('');
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.renderTable();
      this.renderPagination();
      
      // Scroll to top of table
      document.getElementById('tableContainer')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  // ===== SELECTION AND BULK ACTIONS =====
  selectAllItems(checked) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = checked;
      const id = checkbox.dataset.id;
      if (checked) {
        this.selectedItems.add(id);
      } else {
        this.selectedItems.delete(id);
      }
    });
    
    this.updateBulkActions();
  }

  updateBulkActions() {
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = this.selectedItems.size;
    
    if (bulkActions) {
      if (selectedCount > 0) {
        bulkActions.style.display = 'flex';
        bulkActions.querySelector('.selected-count').textContent = selectedCount;
      } else {
        bulkActions.style.display = 'none';
      }
    }

    // Update select all checkbox
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
      const visibleCheckboxes = document.querySelectorAll('.row-checkbox');
      const checkedCount = Array.from(visibleCheckboxes).filter(cb => cb.checked).length;
      
      selectAll.checked = visibleCheckboxes.length > 0 && checkedCount === visibleCheckboxes.length;
      selectAll.indeterminate = checkedCount > 0 && checkedCount < visibleCheckboxes.length;
    }
  }

  // ===== UTILITY METHODS =====
  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
  }

  formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('uk-UA');
  }

  formatRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'щойно';
    if (minutes < 60) return `${minutes} хв тому`;
    if (hours < 24) return `${hours} год тому`;
    return `${days} дн тому`;
  }

  updateRequestsBadge() {
    const badge = document.getElementById('requestsBadge');
    const pendingCount = this.currentData.filter(item => item.status === 'pending').length;
    
    if (badge) {
      badge.textContent = pendingCount;
      badge.style.display = pendingCount > 0 ? 'inline' : 'none';
    }
  }

  // ===== UI STATE MANAGEMENT =====
  showLoading() {
    this.isLoading = true;
    const loadingState = document.getElementById('loadingState');
    const tableContainer = document.getElementById('tableContainer');
    const errorState = document.getElementById('errorState');
    
    if (loadingState) loadingState.style.display = 'flex';
    if (tableContainer) tableContainer.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
  }

  hideLoading() {
    this.isLoading = false;
    const loadingState = document.getElementById('loadingState');
    const tableContainer = document.getElementById('tableContainer');
    
    if (loadingState) loadingState.style.display = 'none';
    if (tableContainer) tableContainer.style.display = 'block';
  }

  showError(message) {
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    const tableContainer = document.getElementById('tableContainer');
    const loadingState = document.getElementById('loadingState');
    
    if (errorState) errorState.style.display = 'flex';
    if (errorMessage) errorMessage.textContent = message;
    if (tableContainer) tableContainer.style.display = 'none';
    if (loadingState) loadingState.style.display = 'none';
  }

  hideError() {
    const errorState = document.getElementById('errorState');
    if (errorState) errorState.style.display = 'none';
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast__icon">
        <i class="fas fa-${this.getToastIcon(type)}"></i>
      </div>
      <div class="toast__message">${message}</div>
      <button class="toast__close">
        <i class="fas fa-times"></i>
      </button>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.remove();
    }, 5000);

    // Close button
    toast.querySelector('.toast__close').addEventListener('click', () => {
      toast.remove();
    });
  }

  getToastIcon(type) {
    const icons = {
      info: 'info-circle',
      success: 'check-circle',
      warning: 'exclamation-triangle',
      error: 'times-circle'
    };
    return icons[type] || 'info-circle';
  }

  // ===== ACTION METHODS =====
  async refreshData() {
    this.showToast('Оновлення даних...', 'info');
    await this.loadRequests();
    this.renderStats();
    this.showToast('Дані оновлено', 'success');
  }

  async performGlobalSearch(query) {
    // Implement global search across all modules
    console.log('Global search:', query);
  }

  async exportData() {
    try {
      const data = this.filteredData;
      const csv = this.generateCSV(data);
      this.downloadCSV(csv, `zajavky_${new Date().toISOString().split('T')[0]}.csv`);
      this.showToast('Дані експортовано', 'success');
    } catch (error) {
      console.error('Export error:', error);
      this.showToast('Помилка експорту', 'error');
    }
  }

  generateCSV(data) {
    const headers = ['ID', 'Звідки', 'Куди', 'Дата подачі', 'Клієнт', 'Телефон', 'Статус', 'Створено'];
    const rows = data.map(item => [
      item.id,
      item.pickupLocation,
      item.deliveryLocation,
      item.pickupDate,
      item.contactName,
      item.phone,
      item.status,
      item.createdAt
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // ===== MODAL METHODS =====
  async viewRequest(id) {
    const request = this.currentData.find(item => item.id.toString() === id.toString());
    if (!request) return;

    const modal = this.createModal('lg', 'Перегляд заявки', this.createViewContent(request));
    this.showModal(modal);
  }

  async editRequest(id) {
    const request = this.currentData.find(item => item.id.toString() === id.toString());
    if (!request) {
      this.showToast('Заявку не знайдено', 'error');
      return;
    }

    const modal = this.createModal('edit', 'Редагування заявки', this.createEditForm(request));
    this.showModal(modal);
  }

  async changeStatus(id) {
    const request = this.currentData.find(item => item.id.toString() === id.toString());
    if (!request) return;

    const modal = this.createModal('md', 'Зміна статусу', this.createStatusForm(request));
    this.showModal(modal);
  }

  async deleteRequest(id) {
    const request = this.currentData.find(item => item.id.toString() === id.toString());
    if (!request) {
      this.showToast('Заявку не знайдено', 'error');
      return;
    }

    // Create confirmation modal
    const confirmModal = this.createModal('md', 'Підтвердження видалення', this.createDeleteConfirmation(request));
    this.showModal(confirmModal);
  }

  createDeleteConfirmation(request) {
    return `
      <div class="confirm-dialog">
        <div class="confirm-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="confirm-title">
          Видалити заявку #${request.id}?
        </div>
        <div class="confirm-message">
          Ця дія незворотна. Заявка від <strong>${request.contactName}</strong> 
          (${request.pickupLocation} → ${request.deliveryLocation}) буде остаточно видалена з бази даних.
        </div>
        <div class="confirm-actions">
          <button class="btn btn--secondary" onclick="adminPanel.closeModal()">
            <i class="fas fa-times"></i>
            Скасувати
          </button>
          <button class="btn btn--error" onclick="adminPanel.confirmDeleteRequest('${request.id}')">
            <i class="fas fa-trash"></i>
            Так, видалити
          </button>
        </div>
      </div>
    `;
  }

  async confirmDeleteRequest(id) {
    try {
      console.log('Attempting to delete request with ID:', id);
      
      // Show loading state
      const deleteBtn = document.querySelector('.confirm-actions .btn--error');
      if (deleteBtn) {
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Видалення...';
        deleteBtn.disabled = true;
      }

      const deleteUrl = `/api/requests/${id}`;
      console.log('DELETE URL:', deleteUrl);

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', [...response.headers]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Delete result:', result);

      if (!result.success && !result.deleted) {
        throw new Error('Сервер повернув невдалий результат');
      }

      this.showToast('Заявку успішно видалено', 'success');
      this.closeModal();
      await this.loadRequests();
      
      // Update selected items if this item was selected
      this.selectedItems.delete(id.toString());
      this.updateBulkActions();
      
    } catch (error) {
      console.error('Delete error details:', {
        message: error.message,
        stack: error.stack,
        id: id
      });
      
      let errorMessage = 'Помилка видалення: ';
      
      if (error.message.includes('404')) {
        errorMessage += 'Заявку не знайдено';
      } else if (error.message.includes('403')) {
        errorMessage += 'Недостатньо прав доступу';
      } else if (error.message.includes('500')) {
        errorMessage += 'Помилка сервера';
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage += 'Проблема з мережею';
      } else {
        errorMessage += error.message;
      }
      
      this.showToast(errorMessage, 'error');
      
      // Restore button state
      const deleteBtn = document.querySelector('.confirm-actions .btn--error');
      if (deleteBtn) {
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Так, видалити';
        deleteBtn.disabled = false;
      }
    }
  }

  async updateRequestStatus(id, newStatus) {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.showToast('Статус оновлено', 'success');
      await this.loadRequests();
    } catch (error) {
      console.error('Update error:', error);
      this.showToast('Помилка оновлення: ' + error.message, 'error');
    }
  }

  async updateRequest(id, updates) {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...updates,
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.showToast('Заявку оновлено', 'success');
      await this.loadRequests();
      this.closeModal();
    } catch (error) {
      console.error('Update error:', error);
      this.showToast('Помилка оновлення: ' + error.message, 'error');
    }
  }

  createModal(size, title, content, footer = null) {
    const modal = document.createElement('div');
    modal.className = `modal modal--${size}`;
    modal.innerHTML = `
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    `;

    // Close button functionality
    modal.querySelector('.close-btn').addEventListener('click', () => {
      this.closeModal();
    });

    return modal;
  }

  showModal(modal) {
    const overlay = document.getElementById('modalOverlay');
    overlay.innerHTML = '';
    overlay.appendChild(modal);
    overlay.classList.add('active');

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeModal();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      this.closeModal();
    }
  };

  createViewContent(request) {
    return `
      <div class="request-details">
        <div class="details-grid">
          <div class="detail-group">
            <h4>Основна інформація</h4>
            <div class="detail-item">
              <label>ID заявки:</label>
              <span>#${request.id}</span>
            </div>
            <div class="detail-item">
              <label>Статус:</label>
              ${this.createStatusBadge(request.status)}
            </div>
            <div class="detail-item">
              <label>Пріоритет:</label>
              ${this.createPriorityBadge(request.priority)}
            </div>
          </div>

          <div class="detail-group">
            <h4>Маршрут</h4>
            <div class="detail-item">
              <label>Звідки:</label>
              <span>${request.pickupLocation}</span>
            </div>
            <div class="detail-item">
              <label>Куди:</label>
              <span>${request.deliveryLocation}</span>
            </div>
            <div class="detail-item">
              <label>Дата подачі:</label>
              <span>${this.formatDate(request.pickupDate)}</span>
            </div>
          </div>

          <div class="detail-group">
            <h4>Характеристики вантажу</h4>
            <div class="detail-item">
              <label>Габарити:</label>
              <span>${request.length} × ${request.width} × ${request.height} м</span>
            </div>
            <div class="detail-item">
              <label>Вага:</label>
              <span>${request.weight} кг</span>
            </div>
            <div class="detail-item">
              <label>Кількість:</label>
              <span>${request.quantity} шт</span>
            </div>
            <div class="detail-item">
              <label>Тип вантажу:</label>
              <span>${request.cargoType}</span>
            </div>
            ${request.adr ? `
              <div class="detail-item">
                <label>ADR класс:</label>
                <span class="adr-class">${request.adrClass}</span>
              </div>
            ` : ''}
          </div>

          <div class="detail-group">
            <h4>Контактна інформація</h4>
            <div class="detail-item">
              <label>Ім'я:</label>
              <span>${request.contactName}</span>
            </div>
            <div class="detail-item">
              <label>Телефон:</label>
              <span>${request.phone}</span>
            </div>
            <div class="detail-item">
              <label>Email:</label>
              <span>${request.email}</span>
            </div>
          </div>

          ${request.comment ? `
            <div class="detail-group">
              <h4>Коментар</h4>
              <div class="comment-text">${request.comment}</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  createEditForm(request) {
    return `
      <div class="edit-form-container">
        <!-- Tab Navigation -->
        <div class="form-tabs">
          <button type="button" class="tab-button active" data-tab="basic">
            <i class="fas fa-info-circle"></i>
            Основна інформація
          </button>
          <button type="button" class="tab-button" data-tab="cargo">
            <i class="fas fa-box"></i>
            Характеристики вантажу
          </button>
          <button type="button" class="tab-button" data-tab="contact">
            <i class="fas fa-user"></i>
            Контакти
          </button>
          <button type="button" class="tab-button" data-tab="management">
            <i class="fas fa-cogs"></i>
            Управління
          </button>
        </div>

        <form id="editRequestForm" class="edit-request-form">
          <!-- Tab 1: Basic Information -->
          <div class="tab-panel active" data-tab="basic">
            <div class="form-section">
              <h4 class="section-title">
                <i class="fas fa-route"></i>
                Маршрут та основна інформація
              </h4>
              <div class="form-card">
                <div class="form-row">
                  <div class="form-group">
                    <label for="editPickupLocation">Звідки <span class="required">*</span></label>
                    <input 
                      type="text" 
                      id="editPickupLocation" 
                      class="form-control" 
                      value="${request.pickupLocation || ''}"
                      required
                      placeholder="Місто відправлення"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="editDeliveryLocation">Куди <span class="required">*</span></label>
                    <input 
                      type="text" 
                      id="editDeliveryLocation" 
                      class="form-control" 
                      value="${request.deliveryLocation || ''}"
                      required
                      placeholder="Місто призначення"
                    >
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="editPickupDate">Дата подачі <span class="required">*</span></label>
                    <input 
                      type="date" 
                      id="editPickupDate" 
                      class="form-control" 
                      value="${request.pickupDate || ''}"
                      required
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="editCargoType">Тип вантажу <span class="required">*</span></label>
                    <select id="editCargoType" class="form-control" required>
                      <option value="">Оберіть тип</option>
                      <option value="Електроніка" ${request.cargoType === 'Електроніка' ? 'selected' : ''}>Електроніка</option>
                      <option value="Будматеріали" ${request.cargoType === 'Будматеріали' ? 'selected' : ''}>Будматеріали</option>
                      <option value="Текстиль" ${request.cargoType === 'Текстиль' ? 'selected' : ''}>Текстиль</option>
                      <option value="Автозапчастини" ${request.cargoType === 'Автозапчастини' ? 'selected' : ''}>Автозапчастини</option>
                      <option value="Продукти харчування" ${request.cargoType === 'Продукти харчування' ? 'selected' : ''}>Продукти харчування</option>
                      <option value="Фармацевтика" ${request.cargoType === 'Фармацевтика' ? 'selected' : ''}>Фармацевтика</option>
                      <option value="Промислове обладнання" ${request.cargoType === 'Промислове обладнання' ? 'selected' : ''}>Промислове обладнання</option>
                      <option value="Документи" ${request.cargoType === 'Документи' ? 'selected' : ''}>Документи</option>
                      <option value="Ювелірні вироби" ${request.cargoType === 'Ювелірні вироби' ? 'selected' : ''}>Ювелірні вироби</option>
                      <option value="Інше" ${request.cargoType === 'Інше' ? 'selected' : ''}>Інше</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label for="editComment">Коментар</label>
                  <textarea 
                    id="editComment" 
                    class="form-control" 
                    rows="3" 
                    placeholder="Додаткова інформація про заявку"
                  >${request.comment || ''}</textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Cargo Characteristics -->
          <div class="tab-panel" data-tab="cargo">
            <div class="form-section">
              <h4 class="section-title">
                <i class="fas fa-cube"></i>
                Габарити та вага
              </h4>
              <div class="form-card">
                <div class="form-row form-row--4">
                  <div class="form-group">
                    <label for="editLength">Довжина (м) <span class="required">*</span></label>
                    <input 
                      type="number" 
                      id="editLength" 
                      class="form-control" 
                      value="${request.length || ''}"
                      step="0.1" 
                      min="0.1" 
                      max="15"
                      required
                      placeholder="0.0"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="editWidth">Ширина (м) <span class="required">*</span></label>
                    <input 
                      type="number" 
                      id="editWidth" 
                      class="form-control" 
                      value="${request.width || ''}"
                      step="0.1" 
                      min="0.1" 
                      max="15"
                      required
                      placeholder="0.0"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="editHeight">Висота (м) <span class="required">*</span></label>
                    <input 
                      type="number" 
                      id="editHeight" 
                      class="form-control" 
                      value="${request.height || ''}"
                      step="0.1" 
                      min="0.1" 
                      max="15"
                      required
                      placeholder="0.0"
                    >
                  </div>

                  <div class="form-group calc-volume">
                    <label>Об'єм (м³)</label>
                    <div class="calculated-value" id="calculatedVolume">
                      ${((request.length || 0) * (request.width || 0) * (request.height || 0) * (request.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="editWeight">Вага (кг) <span class="required">*</span></label>
                    <input 
                      type="number" 
                      id="editWeight" 
                      class="form-control" 
                      value="${request.weight || ''}"
                      min="1" 
                      max="50000"
                      required
                      placeholder="1"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="editQuantity">Кількість <span class="required">*</span></label>
                    <input 
                      type="number" 
                      id="editQuantity" 
                      class="form-control" 
                      value="${request.quantity || ''}"
                      min="1" 
                      max="1000"
                      required
                      placeholder="1"
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4 class="section-title">
                <i class="fas fa-exclamation-triangle"></i>
                ADR та спеціальні вимоги
              </h4>
              <div class="form-card">
                <div class="form-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      id="editIsAdr" 
                      ${request.isAdr ? 'checked' : ''}
                    >
                    <span class="checkmark"></span>
                    Вантаж ADR (небезпечний)
                  </label>
                </div>

                <div class="form-group" id="adrClassGroup" style="display: ${request.isAdr ? 'block' : 'none'}">
                  <label for="editAdrClass">Клас небезпеки ADR</label>
                  <select id="editAdrClass" class="form-control">
                    <option value="">Оберіть клас</option>
                    <option value="Клас 1" ${request.adrClass === 'Клас 1' ? 'selected' : ''}>Клас 1 - Вибухові речовини</option>
                    <option value="Клас 2" ${request.adrClass === 'Клас 2' ? 'selected' : ''}>Клас 2 - Гази</option>
                    <option value="Клас 3" ${request.adrClass === 'Клас 3' ? 'selected' : ''}>Клас 3 - Легкозаймисті рідини</option>
                    <option value="Клас 4.1" ${request.adrClass === 'Клас 4.1' ? 'selected' : ''}>Клас 4.1 - Легкозаймисті тверді речовини</option>
                    <option value="Клас 4.2" ${request.adrClass === 'Клас 4.2' ? 'selected' : ''}>Клас 4.2 - Самозаймисті речовини</option>
                    <option value="Клас 4.3" ${request.adrClass === 'Клас 4.3' ? 'selected' : ''}>Клас 4.3 - Речовини, що виділяють горючі гази</option>
                    <option value="Клас 5.1" ${request.adrClass === 'Клас 5.1' ? 'selected' : ''}>Клас 5.1 - Окислювачі</option>
                    <option value="Клас 5.2" ${request.adrClass === 'Клас 5.2' ? 'selected' : ''}>Клас 5.2 - Органічні пероксиди</option>
                    <option value="Клас 6.1" ${request.adrClass === 'Клас 6.1' ? 'selected' : ''}>Клас 6.1 - Токсичні речовини</option>
                    <option value="Клас 6.2" ${request.adrClass === 'Клас 6.2' ? 'selected' : ''}>Клас 6.2 - Інфекційні речовини</option>
                    <option value="Клас 7" ${request.adrClass === 'Клас 7' ? 'selected' : ''}>Клас 7 - Радіоактивні матеріали</option>
                    <option value="Клас 8" ${request.adrClass === 'Клас 8' ? 'selected' : ''}>Клас 8 - Корозійні речовини</option>
                    <option value="Клас 9" ${request.adrClass === 'Клас 9' ? 'selected' : ''}>Клас 9 - Інші небезпечні речовини</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 3: Contact Information -->
          <div class="tab-panel" data-tab="contact">
            <div class="form-section">
              <h4 class="section-title">
                <i class="fas fa-address-book"></i>
                Контактна інформація
              </h4>
              <div class="form-card">
                <div class="form-row">
                  <div class="form-group">
                    <label for="editContactName">Контактна особа <span class="required">*</span></label>
                    <input 
                      type="text" 
                      id="editContactName" 
                      class="form-control" 
                      value="${request.contactName || ''}"
                      required
                      placeholder="Ім'я та прізвище"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="editPhone">Телефон <span class="required">*</span></label>
                    <input 
                      type="tel" 
                      id="editPhone" 
                      class="form-control" 
                      value="${request.phone || ''}"
                      required
                      placeholder="+380671234567"
                      pattern="^\\+380\\d{9}$"
                    >
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="editEmail">Email</label>
                  <input 
                    type="email" 
                    id="editEmail" 
                    class="form-control" 
                    value="${request.email || ''}"
                    placeholder="example@email.com"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 4: Status and Management -->
          <div class="tab-panel" data-tab="management">
            <div class="form-section">
              <h4 class="section-title">
                <i class="fas fa-tasks"></i>
                Статус та пріоритет
              </h4>
              <div class="form-card">
                <div class="form-row">
                  <div class="form-group">
                    <label for="editStatus">Статус заявки</label>
                    <select id="editStatus" class="form-control">
                      <option value="pending" ${request.status === 'pending' ? 'selected' : ''}>В очікуванні</option>
                      <option value="approved" ${request.status === 'approved' ? 'selected' : ''}>Схвалено</option>
                      <option value="in-progress" ${request.status === 'in-progress' ? 'selected' : ''}>В процесі</option>
                      <option value="completed" ${request.status === 'completed' ? 'selected' : ''}>Завершено</option>
                      <option value="rejected" ${request.status === 'rejected' ? 'selected' : ''}>Відхилено</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label for="editPriority">Пріоритет</label>
                    <select id="editPriority" class="form-control">
                      <option value="low" ${request.priority === 'low' ? 'selected' : ''}>Низький</option>
                      <option value="medium" ${request.priority === 'medium' ? 'selected' : ''}>Середній</option>
                      <option value="high" ${request.priority === 'high' ? 'selected' : ''}>Високий</option>
                      <option value="urgent" ${request.priority === 'urgent' ? 'selected' : ''}>Терміновий</option>
                    </select>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="editAssignedTo">Призначити:</label>
                  <input 
                    type="text" 
                    id="editAssignedTo" 
                    class="form-control" 
                    value="${request.assignedTo || ''}"
                    placeholder="Ім'я відповідального"
                  >
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4 class="section-title">
                <i class="fas fa-info-circle"></i>
                Додаткова інформація
              </h4>
              <div class="form-card">
                <div class="info-grid">
                  <div class="info-item">
                    <label>ID заявки:</label>
                    <span>#${request.id}</span>
                  </div>
                  <div class="info-item">
                    <label>Створено:</label>
                    <span>${this.formatDateTime(request.createdAt)}</span>
                  </div>
                  <div class="info-item">
                    <label>Останнє оновлення:</label>
                    <span>${this.formatDateTime(request.updatedAt) || 'Немає'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation and Submit Buttons -->
          <div class="form-navigation">
            <div class="nav-buttons">
              <button type="button" class="btn btn--secondary" id="prevTab" style="display: none;">
                <i class="fas fa-chevron-left"></i>
                Назад
              </button>
              <button type="button" class="btn btn--primary" id="nextTab">
                Далі
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn--secondary" onclick="adminPanel.closeModal()">
                <i class="fas fa-times"></i>
                Скасувати
              </button>
              <button type="submit" class="btn btn--success">
                <i class="fas fa-save"></i>
                Зберегти зміни
              </button>
            </div>
          </div>
        </form>
      </div>

      <script>
        // Setup form tabs functionality
        function setupFormTabs() {
          const tabs = document.querySelectorAll('.tab-button');
          const panels = document.querySelectorAll('.tab-panel');
          const nextBtn = document.getElementById('nextTab');
          const prevBtn = document.getElementById('prevTab');
          let currentTab = 0;

          function showTab(index) {
            tabs.forEach((tab, i) => {
              tab.classList.toggle('active', i === index);
            });
            panels.forEach((panel, i) => {
              panel.classList.toggle('active', i === index);
            });
            
            prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
            nextBtn.style.display = index === tabs.length - 1 ? 'none' : 'inline-flex';
            currentTab = index;
          }

          tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => showTab(index));
          });

          nextBtn.addEventListener('click', () => {
            if (currentTab < tabs.length - 1) showTab(currentTab + 1);
          });

          prevBtn.addEventListener('click', () => {
            if (currentTab > 0) showTab(currentTab - 1);
          });
        }

        // Setup volume calculation
        function updateVolume() {
          const length = parseFloat(document.getElementById('editLength').value) || 0;
          const width = parseFloat(document.getElementById('editWidth').value) || 0;
          const height = parseFloat(document.getElementById('editHeight').value) || 0;
          const quantity = parseInt(document.getElementById('editQuantity').value) || 1;
          
          const volume = (length * width * height * quantity).toFixed(2);
          document.getElementById('calculatedVolume').textContent = volume;
        }

        // Setup ADR toggle
        document.getElementById('editIsAdr').addEventListener('change', function() {
          const adrClassGroup = document.getElementById('adrClassGroup');
          adrClassGroup.style.display = this.checked ? 'block' : 'none';
          if (!this.checked) {
            document.getElementById('editAdrClass').value = '';
          }
        });

        // Setup form submission
        document.getElementById('editRequestForm').addEventListener('submit', function(e) {
          e.preventDefault();
          adminPanel.saveRequestChanges('${request.id}');
        });

        // Setup phone formatting
        document.getElementById('editPhone').addEventListener('input', function(e) {
          let value = e.target.value.replace(/\\D/g, '');
          if (value.startsWith('380')) {
            value = '+' + value;
          } else if (value.startsWith('0')) {
            value = '+38' + value;
          }
          e.target.value = value;
        });

        // Setup volume calculation listeners
        ['editLength', 'editWidth', 'editHeight', 'editQuantity'].forEach(id => {
          document.getElementById(id).addEventListener('input', updateVolume);
        });

        // Initialize
        setupFormTabs();
        updateVolume();
      </script>
    `;
  }

  createStatusForm(request) {
    return `
      <div class="status-form">
        <div class="form-group">
          <label for="statusSelect">Новий статус:</label>
          <select id="statusSelect" class="form-control">
            <option value="pending" ${request.status === 'pending' ? 'selected' : ''}>В очікуванні</option>
            <option value="approved" ${request.status === 'approved' ? 'selected' : ''}>Схвалено</option>
            <option value="in-progress" ${request.status === 'in-progress' ? 'selected' : ''}>В процесі</option>
            <option value="completed" ${request.status === 'completed' ? 'selected' : ''}>Завершено</option>
            <option value="rejected" ${request.status === 'rejected' ? 'selected' : ''}>Відхилено</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="prioritySelect">Пріоритет:</label>
          <select id="prioritySelect" class="form-control">
            <option value="low" ${request.priority === 'low' ? 'selected' : ''}>Низький</option>
            <option value="medium" ${request.priority === 'medium' ? 'selected' : ''}>Середній</option>
            <option value="high" ${request.priority === 'high' ? 'selected' : ''}>Високий</option>
            <option value="urgent" ${request.priority === 'urgent' ? 'selected' : ''}>Терміновий</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="assignedToInput">Призначити:</label>
          <input type="text" id="assignedToInput" class="form-control" 
                 value="${request.assignedTo || ''}" 
                 placeholder="Ім'я відповідального">
        </div>
        
        <div class="form-actions" style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
          <button class="btn btn--secondary" onclick="adminPanel.closeModal()">Скасувати</button>
          <button class="btn btn--primary" onclick="adminPanel.saveStatusChanges('${request.id}')">Зберегти</button>
        </div>
      </div>
    `;
  }

  async saveStatusChanges(id) {
    const status = document.getElementById('statusSelect')?.value;
    const priority = document.getElementById('prioritySelect')?.value;
    const assignedTo = document.getElementById('assignedToInput')?.value;

    if (!status) {
      this.showToast('Виберіть статус', 'warning');
      return;
    }

    try {
      await this.updateRequest(id, {
        status,
        priority,
        assignedTo: assignedTo || null
      });
    } catch (error) {
      console.error('Error saving status changes:', error);
    }
  }

  async saveRequestChanges(id) {
    try {
      // Collect form data
      const formData = this.collectEditFormData();
      
      // Validate form data
      const validation = this.validateRequestData(formData);
      if (!validation.isValid) {
        this.showToast(validation.message, 'error');
        return;
      }

      // Show loading state
      const submitBtn = document.querySelector('#editRequestForm button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Збереження...';
      submitBtn.disabled = true;

      // Save to database
      await this.updateRequest(id, formData);
      
    } catch (error) {
      console.error('Error saving request changes:', error);
      this.showToast('Помилка збереження: ' + error.message, 'error');
    } finally {
      // Restore button state
      const submitBtn = document.querySelector('#editRequestForm button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Зберегти зміни';
        submitBtn.disabled = false;
      }
    }
  }

  collectEditFormData() {
    return {
      pickupLocation: document.getElementById('editPickupLocation')?.value?.trim(),
      deliveryLocation: document.getElementById('editDeliveryLocation')?.value?.trim(),
      pickupDate: document.getElementById('editPickupDate')?.value,
      cargoType: document.getElementById('editCargoType')?.value,
      length: parseFloat(document.getElementById('editLength')?.value),
      width: parseFloat(document.getElementById('editWidth')?.value),
      height: parseFloat(document.getElementById('editHeight')?.value),
      weight: parseInt(document.getElementById('editWeight')?.value),
      quantity: parseInt(document.getElementById('editQuantity')?.value),
      isAdr: document.getElementById('editIsAdr')?.checked || false,
      adrClass: document.getElementById('editAdrClass')?.value || null,
      contactName: document.getElementById('editContactName')?.value?.trim(),
      phone: document.getElementById('editPhone')?.value?.trim(),
      email: document.getElementById('editEmail')?.value?.trim() || null,
      status: document.getElementById('editStatus')?.value,
      priority: document.getElementById('editPriority')?.value,
      assignedTo: document.getElementById('editAssignedTo')?.value?.trim() || null,
      comment: document.getElementById('editComment')?.value?.trim() || null
    };
  }

  validateRequestData(data) {
    // Required fields validation
    const requiredFields = [
      { field: 'pickupLocation', name: 'Місто відправлення' },
      { field: 'deliveryLocation', name: 'Місто призначення' },
      { field: 'pickupDate', name: 'Дата подачі' },
      { field: 'cargoType', name: 'Тип вантажу' },
      { field: 'contactName', name: 'Контактна особа' },
      { field: 'phone', name: 'Телефон' }
    ];

    for (const { field, name } of requiredFields) {
      if (!data[field]) {
        return { isValid: false, message: `Поле "${name}" є обов'язковим` };
      }
    }

    // Numeric fields validation
    if (isNaN(data.length) || data.length <= 0 || data.length > 15) {
      return { isValid: false, message: 'Довжина має бути числом від 0.1 до 15 метрів' };
    }

    if (isNaN(data.width) || data.width <= 0 || data.width > 15) {
      return { isValid: false, message: 'Ширина має бути числом від 0.1 до 15 метрів' };
    }

    if (isNaN(data.height) || data.height <= 0 || data.height > 15) {
      return { isValid: false, message: 'Висота має бути числом від 0.1 до 15 метрів' };
    }

    if (isNaN(data.weight) || data.weight <= 0 || data.weight > 50000) {
      return { isValid: false, message: 'Вага має бути числом від 1 до 50000 кг' };
    }

    if (isNaN(data.quantity) || data.quantity <= 0 || data.quantity > 1000) {
      return { isValid: false, message: 'Кількість має бути числом від 1 до 1000' };
    }

    // Phone validation
    const phoneRegex = /^\+380\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
      return { isValid: false, message: 'Телефон має бути у форматі +380XXXXXXXXX' };
    }

    // Email validation (optional)
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { isValid: false, message: 'Невірний формат email адреси' };
      }
    }

    // Date validation
    const pickupDate = new Date(data.pickupDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (pickupDate < today) {
      return { isValid: false, message: 'Дата подачі не може бути в минулому' };
    }

    // ADR validation
    if (data.isAdr && !data.adrClass) {
      return { isValid: false, message: 'Для ADR вантажу необхідно вказати клас' };
    }

    return { isValid: true };
  }

  // ===== REAL-TIME UPDATES =====
  setupRealTimeUpdates() {
    // Setup periodic data refresh
    setInterval(() => {
      if (!this.isLoading && this.activeTab === 'requests') {
        this.loadRequests();
      }
    }, 30000); // Refresh every 30 seconds
  }

  renderActivityLog() {
    // Implementation for activity log
    const activityTable = document.getElementById('activityTable');
    if (activityTable) {
      // Render recent activity
    }
  }

  // ===== PLACEHOLDER METHODS =====
  showBulkStatusModal() {
    this.showToast('Bulk status change - в розробці', 'info');
  }

  showBulkAssignModal() {
    this.showToast('Bulk assign - в розробці', 'info');
  }

  confirmBulkDelete() {
    if (confirm(`Ви впевнені, що хочете видалити ${this.selectedItems.size} записів?`)) {
      this.showToast('Bulk delete - в розробці', 'info');
    }
  }

  showAddRequestModal() {
    this.showToast('Add request - в розробці', 'info');
  }

  showColumnsModal() {
    this.showToast('Column selection - в розробці', 'info');
  }

  // ===== DIAGNOSTIC METHODS =====
  async testAPIConnection() {
    console.log('🔍 Testing API connection...');
    
    try {
      // Test GET requests
      console.log('Testing GET /api/requests...');
      const getResponse = await fetch('/api/requests');
      console.log('GET Response status:', getResponse.status);
      console.log('GET Response headers:', [...getResponse.headers]);
      
      if (getResponse.ok) {
        const data = await getResponse.json();
        console.log('✅ GET working, found', data.length, 'requests');
        
        if (data.length > 0) {
          const testId = data[0].id;
          console.log('Testing DELETE with ID:', testId);
          
          // Create a test DELETE request (but don't actually send it)
          const deleteUrl = `/api/requests/${testId}`;
          console.log('DELETE URL would be:', deleteUrl);
          
          // Test if the URL is correctly formed
          try {
            const testResponse = await fetch(deleteUrl, {
              method: 'OPTIONS'
            });
            console.log('OPTIONS Response status:', testResponse.status);
            console.log('OPTIONS Response headers:', [...testResponse.headers]);
          } catch (optionsError) {
            console.error('OPTIONS test failed:', optionsError);
          }
        }
      } else {
        console.error('❌ GET failed with status:', getResponse.status);
      }
      
    } catch (error) {
      console.error('🚨 API Connection test failed:', error);
    }
  }

  // Add this method to window for easy access in console
  exposeDebugMethods() {
    window.testAPI = () => this.testAPIConnection();
    window.debugDelete = (id) => {
      console.log('🐛 Debug delete for ID:', id);
      const request = this.currentData.find(item => item.id.toString() === id.toString());
      console.log('Found request:', request);
      return request;
    };
    console.log('🔧 Debug methods available: testAPI(), debugDelete(id)');
  }
}

// Make the class globally available
window.EnhancedAdminPanel = EnhancedAdminPanel; 