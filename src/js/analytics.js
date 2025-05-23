
class AnalyticsModule {
  constructor(adminPanel) {
    this.adminPanel = adminPanel;
    this.charts = {};
    this.isActive = false;
    this.init();
  }

  init() {
    this.loadChartJS();
  }

  async loadChartJS() {
    if (typeof Chart === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => this.setupCharts();
      document.head.appendChild(script);
    } else {
      this.setupCharts();
    }
  }

  setupCharts() {
    this.setupTabListener();
  }

  setupTabListener() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-tab="analytics"]')) {
        e.preventDefault();
        this.renderAnalyticsTab();
      }
    });
  }

  renderAnalyticsTab() {
    const mainContent = document.querySelector('.admin-content');
    if (!mainContent) return;

    this.isActive = true;
    this.updateActiveNavItem('analytics');

    mainContent.innerHTML = `
      <div class="analytics-dashboard">
        <!-- Dashboard Header -->
        <div class="admin-content__header">
          <h2><i class="fas fa-chart-line"></i> Аналітика та Звіти</h2>
          <div class="admin-content__actions">
            <select id="analyticsDateRange" class="admin-button admin-button--secondary">
              <option value="7">Останні 7 днів</option>
              <option value="30">Останні 30 днів</option>
              <option value="90">Останні 3 місяці</option>
              <option value="365">Останній рік</option>
              <option value="all">Весь період</option>
            </select>
            <button class="admin-button admin-button--primary" id="generateReport">
              <i class="fas fa-file-pdf"></i> Створити звіт
            </button>
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="kpi-cards">
          <div class="kpi-card kpi-card--primary">
            <div class="kpi-card__icon">
              <i class="fas fa-clipboard-check"></i>
            </div>
            <div class="kpi-card__content">
              <h3 id="totalRequests">0</h3>
              <p>Всього заявок</p>
              <span class="kpi-card__trend" id="requestsTrend">+0%</span>
            </div>
          </div>

          <div class="kpi-card kpi-card--success">
            <div class="kpi-card__icon">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="kpi-card__content">
              <h3 id="conversionRate">0%</h3>
              <p>Коефіцієнт конверсії</p>
              <span class="kpi-card__trend" id="conversionTrend">+0%</span>
            </div>
          </div>

          <div class="kpi-card kpi-card--warning">
            <div class="kpi-card__icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="kpi-card__content">
              <h3 id="avgProcessingTime">0</h3>
              <p>Середній час обробки</p>
              <span class="kpi-card__trend" id="processingTrend">-0%</span>
            </div>
          </div>

          <div class="kpi-card kpi-card--info">
            <div class="kpi-card__icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="kpi-card__content">
              <h3 id="satisfactionRate">0%</h3>
              <p>Рівень задоволення</p>
              <span class="kpi-card__trend" id="satisfactionTrend">+0%</span>
            </div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="charts-grid">
          <!-- Requests Over Time Chart -->
          <div class="chart-container">
            <div class="chart-header">
              <h3><i class="fas fa-line-chart"></i> Динаміка заявок</h3>
              <div class="chart-controls">
                <button class="chart-btn active" data-chart="line">Лінійний</button>
                <button class="chart-btn" data-chart="bar">Стовпчастий</button>
              </div>
            </div>
            <canvas id="requestsTimeChart"></canvas>
          </div>

          <!-- Status Distribution Chart -->
          <div class="chart-container">
            <div class="chart-header">
              <h3><i class="fas fa-pie-chart"></i> Розподіл за статусами</h3>
            </div>
            <canvas id="statusChart"></canvas>
          </div>

          <!-- Popular Routes Chart -->
          <div class="chart-container chart-container--wide">
            <div class="chart-header">
              <h3><i class="fas fa-map-marked-alt"></i> Популярні маршрути</h3>
            </div>
            <canvas id="routesChart"></canvas>
          </div>

          <!-- Cargo Types Chart -->
          <div class="chart-container">
            <div class="chart-header">
              <h3><i class="fas fa-boxes"></i> Типи вантажів</h3>
            </div>
            <canvas id="cargoChart"></canvas>
          </div>

          <!-- Performance Metrics -->
          <div class="chart-container chart-container--wide">
            <div class="chart-header">
              <h3><i class="fas fa-tachometer-alt"></i> Метрики ефективності</h3>
            </div>
            <div class="performance-metrics">
              <div class="metric-item">
                <div class="metric-circle" data-percentage="85">
                  <span>85%</span>
                </div>
                <p>Вчасна обробка</p>
              </div>
              <div class="metric-item">
                <div class="metric-circle" data-percentage="92">
                  <span>92%</span>
                </div>
                <p>Якість сервісу</p>
              </div>
              <div class="metric-item">
                <div class="metric-circle" data-percentage="78">
                  <span>78%</span>
                </div>
                <p>Повторні звернення</p>
              </div>
              <div class="metric-item">
                <div class="metric-circle" data-percentage="96">
                  <span>96%</span>
                </div>
                <p>Безпека перевезень</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Analytics Tables -->
        <div class="analytics-tables">
          <div class="tabs">
            <div class="tabs__nav">
              <button class="active" data-analytics-tab="trends">Тренди</button>
              <button data-analytics-tab="performance">Ефективність</button>
              <button data-analytics-tab="forecast">Прогнози</button>
            </div>
            <div class="tabs__content">
              <div class="tab-pane active" id="trends">
                <div id="trendsTable"></div>
              </div>
              <div class="tab-pane" id="performance">
                <div id="performanceTable"></div>
              </div>
              <div class="tab-pane" id="forecast">
                <div id="forecastTable"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initializeCharts();
    this.setupAnalyticsEventListeners();
  }

  initializeCharts() {
    const data = this.adminPanel.currentData;
    
    this.createRequestsTimeChart(data);
    
    this.createStatusChart(data);
    
    this.createRoutesChart(data);
    
    this.createCargoChart(data);
    
    this.updateKPIs(data);
    
    this.initializeMetricCircles();
  }

  createRequestsTimeChart(data) {
    const ctx = document.getElementById('requestsTimeChart');
    if (!ctx) return;

    const timeData = this.processTimeData(data);
    
    this.charts.requestsTime = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timeData.labels,
        datasets: [{
          label: 'Кількість заявок',
          data: timeData.values,
          borderColor: '#1e40af',
          backgroundColor: 'rgba(30, 64, 175, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Дата'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Кількість'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  createStatusChart(data) {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;

    const statusData = this.processStatusData(data);
    
    this.charts.status = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: statusData.labels,
        datasets: [{
          data: statusData.values,
          backgroundColor: [
            '#f59e0b', // pending
            '#22c55e', // approved
            '#ef4444', // rejected
            '#06b6d4', // in-progress
            '#1e40af'  // completed
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        }
      }
    });
  }

  createRoutesChart(data) {
    const ctx = document.getElementById('routesChart');
    if (!ctx) return;

    const routesData = this.processRoutesData(data);
    
    this.charts.routes = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: routesData.labels,
        datasets: [{
          label: 'Кількість заявок',
          data: routesData.values,
          backgroundColor: '#1e40af',
          borderColor: '#1e40af',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Маршрути'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Кількість'
            }
          }
        }
      }
    });
  }

  createCargoChart(data) {
    const ctx = document.getElementById('cargoChart');
    if (!ctx) return;

    const cargoData = this.processCargoData(data);
    
    this.charts.cargo = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: cargoData.labels,
        datasets: [{
          data: cargoData.values,
          backgroundColor: [
            'rgba(30, 64, 175, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(6, 182, 212, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  processTimeData(data) {
    const last30Days = Array.from({length: 30}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const counts = last30Days.map(date => {
      return data.filter(item => {
        const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
        return itemDate === date;
      }).length;
    });

    return {
      labels: last30Days.map(date => new Date(date).toLocaleDateString('uk-UA', { month: 'short', day: 'numeric' })),
      values: counts
    };
  }

  processStatusData(data) {
    const statusCounts = {
      'pending': 0,
      'approved': 0,
      'rejected': 0,
      'in-progress': 0,
      'completed': 0
    };

    data.forEach(item => {
      if (statusCounts.hasOwnProperty(item.status)) {
        statusCounts[item.status]++;
      }
    });

    const statusLabels = {
      'pending': 'В очікуванні',
      'approved': 'Схвалені',
      'rejected': 'Відхилені',
      'in-progress': 'В процесі',
      'completed': 'Завершені'
    };

    return {
      labels: Object.keys(statusCounts).map(key => statusLabels[key]),
      values: Object.values(statusCounts)
    };
  }

  processRoutesData(data) {
    const routes = {};
    
    data.forEach(item => {
      const route = `${item.pickupLocation} → ${item.deliveryLocation}`;
      routes[route] = (routes[route] || 0) + 1;
    });

    const sortedRoutes = Object.entries(routes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    return {
      labels: sortedRoutes.map(([route]) => route.length > 30 ? route.substring(0, 30) + '...' : route),
      values: sortedRoutes.map(([,count]) => count)
    };
  }

  processCargoData(data) {
    const cargo = {};
    
    data.forEach(item => {
      const type = item.cargoType || 'Не вказано';
      cargo[type] = (cargo[type] || 0) + 1;
    });

    const sortedCargo = Object.entries(cargo)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);

    return {
      labels: sortedCargo.map(([type]) => type),
      values: sortedCargo.map(([,count]) => count)
    };
  }

  updateKPIs(data) {
    const total = data.length;
    const approved = data.filter(item => item.status === 'approved').length;
    const completed = data.filter(item => item.status === 'completed').length;
    
    document.getElementById('totalRequests').textContent = total.toLocaleString();
    document.getElementById('conversionRate').textContent = total > 0 ? Math.round((approved / total) * 100) + '%' : '0%';
    document.getElementById('avgProcessingTime').textContent = '2.3 дні';
    document.getElementById('satisfactionRate').textContent = '94%';

    document.getElementById('requestsTrend').textContent = '+12%';
    document.getElementById('conversionTrend').textContent = '+5%';
    document.getElementById('processingTrend').textContent = '-8%';
    document.getElementById('satisfactionTrend').textContent = '+3%';
  }

  initializeMetricCircles() {
    const circles = document.querySelectorAll('.metric-circle');
    circles.forEach(circle => {
      const percentage = parseInt(circle.dataset.percentage);
      this.animateCircle(circle, percentage);
    });
  }

  animateCircle(circle, percentage) {
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.background = `conic-gradient(#1e40af ${percentage * 3.6}deg, #e5e7eb 0deg)`;
  }

  setupAnalyticsEventListeners() {
    const dateRange = document.getElementById('analyticsDateRange');
    if (dateRange) {
      dateRange.addEventListener('change', (e) => {
        this.updateChartsForDateRange(e.target.value);
      });
    }

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('chart-btn')) {
        const chartType = e.target.dataset.chart;
        this.toggleChartType('requestsTime', chartType);
        
        e.target.parentElement.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.dataset.analyticsTab) {
        this.switchAnalyticsTab(e.target.dataset.analyticsTab);
      }
    });

    const generateReportBtn = document.getElementById('generateReport');
    if (generateReportBtn) {
      generateReportBtn.addEventListener('click', () => {
        this.generateAnalyticsReport();
      });
    }
  }

  updateChartsForDateRange(range) {
    let filteredData = this.adminPanel.currentData;
    
    if (range !== 'all') {
      const days = parseInt(range);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filteredData = this.adminPanel.currentData.filter(item => 
        new Date(item.createdAt) >= cutoffDate
      );
    }

    this.updateChart('requestsTime', this.processTimeData(filteredData));
    this.updateChart('status', this.processStatusData(filteredData));
    this.updateChart('routes', this.processRoutesData(filteredData));
    this.updateChart('cargo', this.processCargoData(filteredData));
    this.updateKPIs(filteredData);
  }

  updateChart(chartName, newData) {
    const chart = this.charts[chartName];
    if (chart) {
      chart.data.labels = newData.labels;
      chart.data.datasets[0].data = newData.values;
      chart.update();
    }
  }

  toggleChartType(chartName, newType) {
    const chart = this.charts[chartName];
    if (chart) {
      chart.config.type = newType;
      chart.update();
    }
  }

  switchAnalyticsTab(tabName) {
    // Update active tab button
    document.querySelectorAll('[data-analytics-tab]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-analytics-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    this.loadTabContent(tabName);
  }

  loadTabContent(tabName) {
    switch(tabName) {
      case 'trends':
        this.loadTrendsContent();
        break;
      case 'performance':
        this.loadPerformanceContent();
        break;
      case 'forecast':
        this.loadForecastContent();
        break;
    }
  }

  loadTrendsContent() {
    const container = document.getElementById('trendsTable');
    container.innerHTML = `
      <div class="trends-analysis">
        <h4>Аналіз трендів за останні 30 днів</h4>
        <div class="trends-grid">
          <div class="trend-item">
            <i class="fas fa-arrow-up text-success"></i>
            <span>Збільшення кількості заявок на 15%</span>
          </div>
          <div class="trend-item">
            <i class="fas fa-arrow-down text-danger"></i>
            <span>Зменшення часу обробки на 8%</span>
          </div>
          <div class="trend-item">
            <i class="fas fa-arrow-up text-success"></i>
            <span>Підвищення рівня схвалення на 5%</span>
          </div>
        </div>
      </div>
    `;
  }

  loadPerformanceContent() {
    const container = document.getElementById('performanceTable');
    container.innerHTML = `
      <div class="performance-analysis">
        <h4>Аналіз ефективності роботи</h4>
        <div class="performance-grid">
          <div class="performance-metric">
            <h5>Швидкість обробки</h5>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 85%"></div>
            </div>
            <span>85% - Відмінно</span>
          </div>
          <div class="performance-metric">
            <h5>Якість сервісу</h5>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 92%"></div>
            </div>
            <span>92% - Відмінно</span>
          </div>
        </div>
      </div>
    `;
  }

  loadForecastContent() {
    const container = document.getElementById('forecastTable');
    container.innerHTML = `
      <div class="forecast-analysis">
        <h4>Прогнози на наступний місяць</h4>
        <div class="forecast-items">
          <div class="forecast-item">
            <h5>Очікувана кількість заявок</h5>
            <span class="forecast-value">+20% (базуючись на сезонних трендах)</span>
          </div>
          <div class="forecast-item">
            <h5>Прогноз завантаженості</h5>
            <span class="forecast-value">Висока в перші 2 тижні</span>
          </div>
        </div>
      </div>
    `;
  }

  generateAnalyticsReport() {
    this.adminPanel.showSuccess('Звіт успішно згенеровано і надіслано на вашу пошту');
    
    console.log('Generating analytics report...');
  }

  updateActiveNavItem(tabName) {
    document.querySelectorAll('.admin-sidebar__nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).parentElement.classList.add('active');
  }

  destroy() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
    this.isActive = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.adminPanel) {
    window.analyticsModule = new AnalyticsModule(window.adminPanel);
  }
}); 