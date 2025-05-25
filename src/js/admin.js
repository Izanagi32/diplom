// Admin Panel Application
class AdminPanel {
  constructor() {
    this.currentData = [];
    this.filteredData = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.filters = {
      status: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    };
    
    this.init();
  }

  async init() {
    // Check authentication first
    if (!this.checkAuthentication()) {
      window.location.href = './admin-login.html';
      return;
    }
    
    this.setupEventListeners();
    this.setupLogout();
    await this.loadRequests();
    this.renderStats();
  }

  // Authentication
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
    const userElement = document.querySelector('.admin-header__user');
    if (userElement) {
      const logoutButton = document.createElement('button');
      logoutButton.className = 'admin-header__logout';
      logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Вийти';
      
      logoutButton.addEventListener('click', () => {
        if (confirm('Ви впевнені, що хочете вийти?')) {
          localStorage.removeItem('adminLoggedIn');
          localStorage.removeItem('adminLoginTime');
          sessionStorage.removeItem('adminLoggedIn');
          window.location.href = './admin-login.html';
        }
      });
      
      userElement.appendChild(logoutButton);
    }
  }

  // Event Listeners
  setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchRequests');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value;
        this.applyFilters();
      });
    }

    // Items per page
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
      itemsPerPageSelect.addEventListener('change', (e) => {
        this.itemsPerPage = parseInt(e.target.value);
        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
      });
    }

    // Filters
    this.setupFilterListeners();
    
    // Bulk actions
    this.setupBulkActions();
    
    // Export button
    const exportBtn = document.querySelector('[data-action="export"]');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportData());
    }
  }

  setupFilterListeners() {
    const statusFilter = document.getElementById('statusFilter');
    const dateFromFilter = document.getElementById('dateFromFilter');
    const dateToFilter = document.getElementById('dateToFilter');

    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.filters.status = e.target.value;
        this.applyFilters();
      });
    }

    if (dateFromFilter) {
      dateFromFilter.addEventListener('change', (e) => {
        this.filters.dateFrom = e.target.value;
        this.applyFilters();
      });
    }

    if (dateToFilter) {
      dateToFilter.addEventListener('change', (e) => {
        this.filters.dateTo = e.target.value;
        this.applyFilters();
      });
    }
  }

  setupBulkActions() {
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
        this.updateBulkActions();
      });
    }
  }

  updateBulkActions() {
    const selectedCount = document.querySelectorAll('.row-checkbox:checked').length;
    const bulkActionsDiv = document.getElementById('bulkActions');
    
    if (bulkActionsDiv) {
      if (selectedCount > 0) {
        bulkActionsDiv.style.display = 'flex';
        bulkActionsDiv.querySelector('.selected-count').textContent = selectedCount;
      } else {
        bulkActionsDiv.style.display = 'none';
      }
    }
  }

  // Data Loading
  async loadRequests() {
    try {
      this.showLoading();
      const response = await fetch('/api/requests');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      // Add status field if missing
      this.currentData = data.map(item => ({
        ...item,
        status: item.status || 'pending',
        priority: item.priority || 'medium'
      }));
      
      this.filteredData = [...this.currentData];
      this.renderTable();
      this.renderPagination();
      this.hideError();
      
    } catch (error) {
      console.error('Error loading requests:', error);
      this.showError('Помилка завантаження заявок: ' + error.message);
    } finally {
      this.hideLoading();
    }
  }

  // Filtering and Sorting
  applyFilters() {
    this.filteredData = this.currentData.filter(item => {
      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        const searchFields = [
          item.pickupLocation, item.deliveryLocation, item.contactName,
          item.phone, item.email, item.cargoType, item.comment
        ].map(field => (field || '').toLowerCase());
        
        if (!searchFields.some(field => field.includes(searchTerm))) {
          return false;
        }
      }

      // Status filter
      if (this.filters.status && item.status !== this.filters.status) {
        return false;
      }

      // Date filters
      if (this.filters.dateFrom || this.filters.dateTo) {
        const itemDate = new Date(item.createdAt);
        if (this.filters.dateFrom && itemDate < new Date(this.filters.dateFrom)) {
          return false;
        }
        if (this.filters.dateTo && itemDate > new Date(this.filters.dateTo)) {
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
      let valueA = a[column];
      let valueB = b[column];

      // Handle different data types
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.renderTable();
    this.updateSortHeaders();
  }

  updateSortHeaders() {
    const headers = document.querySelectorAll('.admin-table thead th.sortable');
    headers.forEach(header => {
      header.classList.remove('sort-asc', 'sort-desc');
      if (header.dataset.column === this.sortColumn) {
        header.classList.add(`sort-${this.sortDirection}`);
      }
    });
  }

  // Rendering
  renderStats() {
    const stats = this.calculateStats();
    const statsContainer = document.getElementById('statsContainer');
    
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card__header">
              <h4>Всього заявок</h4>
              <div class="icon icon--primary">
                <i class="fas fa-clipboard-list"></i>
              </div>
            </div>
            <div class="stat-card__value">${stats.total}</div>
            <div class="stat-card__change stat-card__change--positive">
              +${stats.newToday} сьогодні
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card__header">
              <h4>В очікуванні</h4>
              <div class="icon icon--warning">
                <i class="fas fa-clock"></i>
              </div>
            </div>
            <div class="stat-card__value">${stats.pending}</div>
            <div class="stat-card__change">
              ${((stats.pending / stats.total) * 100).toFixed(1)}% від загальної кількості
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card__header">
              <h4>Схвалені</h4>
              <div class="icon icon--success">
                <i class="fas fa-check-circle"></i>
              </div>
            </div>
            <div class="stat-card__value">${stats.approved}</div>
            <div class="stat-card__change stat-card__change--positive">
              ${((stats.approved / stats.total) * 100).toFixed(1)}% від загальної кількості
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card__header">
              <h4>Завершені</h4>
              <div class="icon icon--primary">
                <i class="fas fa-truck"></i>
              </div>
            </div>
            <div class="stat-card__value">${stats.completed}</div>
            <div class="stat-card__change stat-card__change--positive">
              ${((stats.completed / stats.total) * 100).toFixed(1)}% від загальної кількості
            </div>
          </div>
        </div>
      `;
    }
  }

  calculateStats() {
    const today = new Date().toDateString();
    return {
      total: this.currentData.length,
      pending: this.currentData.filter(item => item.status === 'pending').length,
      approved: this.currentData.filter(item => item.status === 'approved').length,
      completed: this.currentData.filter(item => item.status === 'completed').length,
      newToday: this.currentData.filter(item => 
        new Date(item.createdAt).toDateString() === today
      ).length
    };
  }

  renderTable() {
    const tbody = document.querySelector('#requests-table tbody');
    if (!tbody) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageData = this.filteredData.slice(startIndex, endIndex);

    tbody.innerHTML = '';

    if (pageData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 2rem;">
            <i class="fas fa-inbox" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
            <div>Заявки не знайдені</div>
          </td>
        </tr>
      `;
      return;
    }

    pageData.forEach(item => {
      const row = this.createTableRow(item);
      tbody.appendChild(row);
    });
  }

  createTableRow(item) {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    
    const formattedTime = this.formatDateTime(item.createdAt);
    const statusBadge = this.createStatusBadge(item.status);
    const priorityBadge = this.createPriorityBadge(item.priority);

    tr.innerHTML = `
      <td class="checkbox-cell">
        <input type="checkbox" class="row-checkbox" value="${item.id}">
      </td>
      <td>${item.id}</td>
      <td>
        <div><strong>Звідки:</strong> ${item.pickupLocation || 'Не вказано'}</div>
        <div><strong>Куди:</strong> ${item.deliveryLocation || 'Не вказано'}</div>
      </td>
      <td>${item.length}×${item.width}×${item.height}</td>
      <td>
        <div><strong>Вага:</strong> ${item.weight} кг</div>
        <div><strong>Кількість:</strong> ${item.quantity}</div>
      </td>
      <td>
        <div><strong>Тип:</strong> ${item.cargoType || 'Не вказано'}</div>
        <div><strong>ADR:</strong> ${item.adr ? 'Так' : 'Ні'}</div>
        ${item.adr && item.adrClass ? `<div><strong>Клас:</strong> ${item.adrClass}</div>` : ''}
      </td>
      <td class="comment-cell" title="${item.comment || ''}">
        ${this.truncateText(item.comment || 'Немає коментарів', 50)}
      </td>
      <td>${item.pickupDate || 'Не вказано'}</td>
      <td>
        <div><strong>${item.contactName || 'Не вказано'}</strong></div>
        <div><i class="fas fa-phone"></i> ${item.phone || 'Не вказано'}</div>
        <div><i class="fas fa-envelope"></i> ${item.email || 'Не вказано'}</div>
      </td>
      <td>
        ${statusBadge}
        ${priorityBadge}
      </td>
      <td>${formattedTime}</td>
      <td class="actions">
        <div class="btn-group">
          <button class="view-btn tooltip" data-tooltip="Переглянути" onclick="adminPanel.viewRequest(${item.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="edit-btn tooltip" data-tooltip="Редагувати" onclick="adminPanel.editRequest(${item.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="approve-btn tooltip" data-tooltip="Змінити статус" onclick="adminPanel.changeStatus(${item.id})">
            <i class="fas fa-check"></i>
          </button>
          <button class="delete-btn tooltip" data-tooltip="Видалити" onclick="adminPanel.deleteRequest(${item.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    `;

    // Add event listener for checkbox
    const checkbox = tr.querySelector('.row-checkbox');
    checkbox.addEventListener('change', () => this.updateBulkActions());

    return tr;
  }

  createStatusBadge(status) {
    const statusConfig = {
      pending: { class: 'status-badge--pending', icon: 'fas fa-clock', text: 'В очікуванні' },
      approved: { class: 'status-badge--approved', icon: 'fas fa-check', text: 'Схвалено' },
      rejected: { class: 'status-badge--rejected', icon: 'fas fa-times', text: 'Відхилено' },
      'in-progress': { class: 'status-badge--in-progress', icon: 'fas fa-spinner', text: 'В процесі' },
      completed: { class: 'status-badge--completed', icon: 'fas fa-check-circle', text: 'Завершено' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return `<div class="status-badge ${config.class}">
      <i class="${config.icon}"></i>
      ${config.text}
    </div>`;
  }

  createPriorityBadge(priority) {
    const priorityConfig = {
      low: { class: 'status-badge--approved', text: 'Низький' },
      medium: { class: 'status-badge--pending', text: 'Середній' },
      high: { class: 'status-badge--rejected', text: 'Високий' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return `<div class="status-badge ${config.class}" style="margin-top: 0.25rem;">
      ${config.text}
    </div>`;
  }

  renderPagination() {
    const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    const pagination = document.querySelector('.admin-pagination');
    
    if (!pagination) return;

    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredData.length);

    pagination.innerHTML = `
      <div class="admin-pagination__info">
        Показано ${startItem}-${endItem} з ${this.filteredData.length} записів
      </div>
      <div class="admin-pagination__controls">
        <div class="admin-pagination__select">
          <label>Показати:</label>
          <select id="itemsPerPage">
            <option value="10" ${this.itemsPerPage === 10 ? 'selected' : ''}>10</option>
            <option value="25" ${this.itemsPerPage === 25 ? 'selected' : ''}>25</option>
            <option value="50" ${this.itemsPerPage === 50 ? 'selected' : ''}>50</option>
            <option value="100" ${this.itemsPerPage === 100 ? 'selected' : ''}>100</option>
          </select>
        </div>
        <button class="admin-pagination__button" ${this.currentPage === 1 ? 'disabled' : ''} onclick="adminPanel.goToPage(${this.currentPage - 1})">
          <i class="fas fa-angle-left"></i>
        </button>
        <span class="admin-pagination__current">${this.currentPage}</span> з <span class="admin-pagination__total">${totalPages}</span>
        <button class="admin-pagination__button" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="adminPanel.goToPage(${this.currentPage + 1})">
          <i class="fas fa-angle-right"></i>
        </button>
      </div>
    `;

    // Re-attach event listener for items per page
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
      itemsPerPageSelect.addEventListener('change', (e) => {
        this.itemsPerPage = parseInt(e.target.value);
        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
      });
    }
  }

  goToPage(page) {
    const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.renderTable();
      this.renderPagination();
    }
  }

  // CRUD Operations
  async viewRequest(id) {
    const request = this.currentData.find(item => item.id == id);
    if (!request) return;

    const modal = this.createModal('large', 'Деталі заявки #' + id, this.createViewContent(request));
    this.showModal(modal);
  }

  async editRequest(id) {
    const request = this.currentData.find(item => item.id == id);
    if (!request) return;

    const modal = this.createModal('medium', 'Редагування заявки #' + id, this.createEditForm(request));
    this.showModal(modal);
  }

  async changeStatus(id) {
    const request = this.currentData.find(item => item.id == id);
    if (!request) return;

    const modal = this.createModal('small', 'Зміна статусу заявки #' + id, this.createStatusForm(request));
    this.showModal(modal);
  }

  async deleteRequest(id) {
    if (!confirm('Ви впевнені, що хочете видалити цю заявку? Цю дію неможливо скасувати.')) {
      return;
    }

    try {
      this.showLoading();
      
      // Send delete request to API
      const response = await fetch(`/api/requests?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Delete result:', result);
      
      // Remove from local data
      this.currentData = this.currentData.filter(item => item.id != id);
      this.applyFilters();
      this.renderStats();
      this.showSuccess('Заявку успішно видалено');
    } catch (error) {
      console.error('Delete error:', error);
      this.showError('Помилка при видаленні заявки: ' + error.message);
    } finally {
      this.hideLoading();
    }
  }

  // Modal Management
  createModal(size, title, content, footer = null) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = `modal modal--${size}`;
    
    modal.innerHTML = `
      <div class="modal__header">
        <h3>${title}</h3>
        <button class="close-btn" onclick="adminPanel.closeModal()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal__body">
        ${content}
      </div>
      ${footer ? `<div class="modal__footer">${footer}</div>` : ''}
    `;
    
    overlay.appendChild(modal);
    return overlay;
  }

  showModal(modalOverlay) {
    document.body.appendChild(modalOverlay);
    setTimeout(() => modalOverlay.classList.add('active'), 10);
    
    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        this.closeModal();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      this.closeModal();
    }
  }

  // Form Content Creators
  createViewContent(request) {
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <h4 style="margin-bottom: 1rem; color: #1e40af;">Інформація про маршрут</h4>
          <div class="form-group">
            <label>Звідки:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${request.pickupLocation || 'Не вказано'}
            </div>
          </div>
          <div class="form-group">
            <label>Куди:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${request.deliveryLocation || 'Не вказано'}
            </div>
          </div>
          <div class="form-group">
            <label>Дата подачі:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${request.pickupDate || 'Не вказано'}
            </div>
          </div>
        </div>
        
        <div>
          <h4 style="margin-bottom: 1rem; color: #1e40af;">Характеристики вантажу</h4>
          <div class="form-group">
            <label>Розміри (Д×Ш×В):</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${request.length}×${request.width}×${request.height} м
            </div>
          </div>
          <div class="form-group">
            <label>Вага:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${request.weight} кг
            </div>
          </div>
          <div class="form-group">
            <label>Кількість:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${request.quantity}
            </div>
          </div>
          <div class="form-group">
            <label>Тип вантажу:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${request.cargoType || 'Не вказано'}
            </div>
          </div>
          <div class="form-group">
            <label>ADR:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${request.adr ? `Так${request.adrClass ? ` (${request.adrClass})` : ''}` : 'Ні'}
            </div>
          </div>
        </div>
        
        <div style="grid-column: 1 / -1;">
          <h4 style="margin-bottom: 1rem; color: #1e40af;">Контактна інформація</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div class="form-group">
              <label>Ім'я:</label>
              <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
                ${request.contactName || 'Не вказано'}
              </div>
            </div>
            <div class="form-group">
              <label>Телефон:</label>
              <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
                ${request.phone || 'Не вказано'}
              </div>
            </div>
            <div class="form-group">
              <label>Email:</label>
              <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
                ${request.email || 'Не вказано'}
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Коментар:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px; min-height: 60px;">
              ${request.comment || 'Немає коментарів'}
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
            <div class="form-group">
              <label>Статус:</label>
              ${this.createStatusBadge(request.status)}
            </div>
            <div class="form-group">
              <label>Дата створення:</label>
              <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
                ${this.formatDateTime(request.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createEditForm(request) {
    return `
      <form id="editRequestForm">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <div class="form-group">
            <label>Звідки: <span class="required">*</span></label>
            <input type="text" name="pickupLocation" value="${request.pickupLocation || ''}" required>
          </div>
          
          <div class="form-group">
            <label>Куди: <span class="required">*</span></label>
            <input type="text" name="deliveryLocation" value="${request.deliveryLocation || ''}" required>
          </div>
          
          <div class="form-group">
            <label>Дата подачі:</label>
            <input type="date" name="pickupDate" value="${request.pickupDate || ''}">
          </div>
          
          <div class="form-group">
            <label>Тип вантажу:</label>
            <input type="text" name="cargoType" value="${request.cargoType || ''}">
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
          <div class="form-group">
            <label>Довжина (м):</label>
            <input type="number" name="length" value="${request.length || ''}" step="0.01" min="0">
          </div>
          
          <div class="form-group">
            <label>Ширина (м):</label>
            <input type="number" name="width" value="${request.width || ''}" step="0.01" min="0">
          </div>
          
          <div class="form-group">
            <label>Висота (м):</label>
            <input type="number" name="height" value="${request.height || ''}" step="0.01" min="0">
          </div>
          
          <div class="form-group">
            <label>Вага (кг):</label>
            <input type="number" name="weight" value="${request.weight || ''}" step="0.01" min="0">
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label>Кількість:</label>
            <input type="number" name="quantity" value="${request.quantity || 1}" min="1">
          </div>
          
          <div class="form-group">
            <label>ADR:</label>
            <select name="adr">
              <option value="false" ${!request.adr ? 'selected' : ''}>Ні</option>
              <option value="true" ${request.adr ? 'selected' : ''}>Так</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Клас ADR:</label>
            <input type="text" name="adrClass" value="${request.adrClass || ''}">
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label>Ім'я контакту:</label>
            <input type="text" name="contactName" value="${request.contactName || ''}">
          </div>
          
          <div class="form-group">
            <label>Телефон:</label>
            <input type="tel" name="phone" value="${request.phone || ''}">
          </div>
          
          <div class="form-group">
            <label>Email:</label>
            <input type="email" name="email" value="${request.email || ''}">
          </div>
        </div>
        
        <div class="form-group">
          <label>Коментар:</label>
          <textarea name="comment" rows="3">${request.comment || ''}</textarea>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
          <button type="button" class="admin-button admin-button--secondary" onclick="adminPanel.closeModal()">
            Скасувати
          </button>
          <button type="submit" class="admin-button admin-button--primary">
            <i class="fas fa-save"></i> Зберегти зміни
          </button>
        </div>
      </form>
    `;
  }

  createStatusForm(request) {
    return `
      <form id="statusForm">
        <div class="form-group">
          <label>Поточний статус:</label>
          ${this.createStatusBadge(request.status)}
        </div>
        
        <div class="form-group">
          <label>Новий статус: <span class="required">*</span></label>
          <select name="status" required>
            <option value="pending" ${request.status === 'pending' ? 'selected' : ''}>В очікуванні</option>
            <option value="approved" ${request.status === 'approved' ? 'selected' : ''}>Схвалено</option>
            <option value="rejected" ${request.status === 'rejected' ? 'selected' : ''}>Відхилено</option>
            <option value="in-progress" ${request.status === 'in-progress' ? 'selected' : ''}>В процесі</option>
            <option value="completed" ${request.status === 'completed' ? 'selected' : ''}>Завершено</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Пріоритет:</label>
          <select name="priority">
            <option value="low" ${request.priority === 'low' ? 'selected' : ''}>Низький</option>
            <option value="medium" ${request.priority === 'medium' ? 'selected' : ''}>Середній</option>
            <option value="high" ${request.priority === 'high' ? 'selected' : ''}>Високий</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Коментар до зміни статусу:</label>
          <textarea name="statusComment" rows="3" placeholder="Додайте коментар до зміни статусу (необов'язково)"></textarea>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
          <button type="button" class="admin-button admin-button--secondary" onclick="adminPanel.closeModal()">
            Скасувати
          </button>
          <button type="submit" class="admin-button admin-button--primary">
            <i class="fas fa-check"></i> Оновити статус
          </button>
        </div>
      </form>
    `;
  }

  // Utility Functions
  formatDateTime(dateString) {
    if (!dateString) return 'Не вказано';
    
    try {
      const utcString = dateString.replace(' ', 'T') + 'Z';
      const date = new Date(utcString);
      return date.toLocaleString('uk-UA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // UI Feedback
  showLoading() {
    const container = document.querySelector('.admin-table-container');
    if (container) {
      container.classList.add('loading');
    }
  }

  hideLoading() {
    const container = document.querySelector('.admin-table-container');
    if (container) {
      container.classList.remove('loading');
    }
  }

  showError(message) {
    this.showMessage(message, 'error');
  }

  showSuccess(message) {
    this.showMessage(message, 'success');
  }

  showMessage(message, type = 'info') {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
      errorDiv.className = `admin-message admin-message--${type}`;
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      
      // Auto hide after 5 seconds
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 5000);
    }
  }

  hideError() {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  }

  // Export functionality
  exportData() {
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `requests_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  generateCSV() {
    const headers = [
      'ID', 'Звідки', 'Куди', 'Довжина', 'Ширина', 'Висота', 'Вага', 
      'Кількість', 'Тип вантажу', 'ADR', 'Клас ADR', 'Коментар', 
      'Дата подачі', 'Контактне ім\'я', 'Телефон', 'Email', 'Статус', 'Створено'
    ];
    
    const rows = this.filteredData.map(item => [
      item.id,
      item.pickupLocation || '',
      item.deliveryLocation || '',
      item.length || '',
      item.width || '',
      item.height || '',
      item.weight || '',
      item.quantity || '',
      item.cargoType || '',
      item.adr ? 'Так' : 'Ні',
      item.adrClass || '',
      (item.comment || '').replace(/"/g, '""'),
      item.pickupDate || '',
      item.contactName || '',
      item.phone || '',
      item.email || '',
      item.status || '',
      this.formatDateTime(item.createdAt)
    ]);
    
    const csvArray = [headers, ...rows];
    return csvArray.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }
}

// Initialize the application
let adminPanel;

document.addEventListener('DOMContentLoaded', () => {
  adminPanel = new AdminPanel();
  
  // Handle form submissions
  document.addEventListener('submit', async (e) => {
    if (e.target.id === 'editRequestForm') {
      e.preventDefault();
      await handleEditSubmit(e.target);
    } else if (e.target.id === 'statusForm') {
      e.preventDefault();
      await handleStatusSubmit(e.target);
    }
  });
});

// Form submission handlers
async function handleEditSubmit(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  try {
    // Get request ID from modal title
    const requestId = parseInt(document.querySelector('.modal h3').textContent.match(/\d+/)[0]);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Збереження...';
    submitBtn.disabled = true;
    
    // Prepare data for API
    const updateData = {
      id: requestId,
      pickupLocation: data.pickupLocation,
      deliveryLocation: data.deliveryLocation,
      length: parseFloat(data.length),
      width: parseFloat(data.width),
      height: parseFloat(data.height),
      weight: parseFloat(data.weight),
      quantity: parseInt(data.quantity),
      cargoType: data.cargoType,
      adr: data.adr === 'true',
      adrClass: data.adrClass,
      comment: data.comment,
      pickupDate: data.pickupDate,
      contactName: data.contactName,
      phone: data.phone,
      email: data.email
    };
    
    // Send update request to API
    const response = await fetch('/api/requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Edit update result:', result);
    
    // Update local data
    const requestIndex = adminPanel.currentData.findIndex(item => item.id === requestId);
    
    if (requestIndex !== -1) {
      adminPanel.currentData[requestIndex] = {
        ...adminPanel.currentData[requestIndex],
        ...data,
        adr: data.adr === 'true',
        updatedAt: result.data.updatedAt
      };
      
      adminPanel.applyFilters();
      adminPanel.closeModal();
      adminPanel.showSuccess('Заявку успішно оновлено');
    }
    
  } catch (error) {
    console.error('Edit update error:', error);
    adminPanel.showError('Помилка при оновленні заявки: ' + error.message);
    
    // Restore button state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-save"></i> Зберегти зміни';
      submitBtn.disabled = false;
    }
  }
}

async function handleStatusSubmit(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  try {
    // Get request ID from modal title
    const requestId = parseInt(document.querySelector('.modal h3').textContent.match(/\d+/)[0]);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Оновлення...';
    submitBtn.disabled = true;
    
    // Send update request to API
    const response = await fetch('/api/requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: requestId,
        status: data.status,
        priority: data.priority,
        statusComment: data.statusComment
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Status update result:', result);
    
    // Update local data
    const requestIndex = adminPanel.currentData.findIndex(item => item.id === requestId);
    
    if (requestIndex !== -1) {
      adminPanel.currentData[requestIndex] = {
        ...adminPanel.currentData[requestIndex],
        status: data.status,
        priority: data.priority,
        statusComment: data.statusComment,
        updatedAt: result.data.updatedAt
      };
      
      adminPanel.applyFilters();
      adminPanel.renderStats();
      adminPanel.closeModal();
      adminPanel.showSuccess('Статус заявки успішно оновлено');
    }
    
  } catch (error) {
    console.error('Status update error:', error);
    adminPanel.showError('Помилка при оновленні статусу: ' + error.message);
    
    // Restore button state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Оновити статус';
      submitBtn.disabled = false;
    }
  }
} 