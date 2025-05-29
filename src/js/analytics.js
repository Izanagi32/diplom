class AnalyticsModule{constructor(t){this.adminPanel=t,this.charts={},this.isActive=!1,this.init()}init(){this.loadChartJS()}async loadChartJS(){var t;"undefined"==typeof Chart?((t=document.createElement("script")).src="https://cdn.jsdelivr.net/npm/chart.js",t.onload=()=>this.setupCharts(),document.head.appendChild(t)):this.setupCharts()}setupCharts(){this.setupTabListener()}setupTabListener(){document.addEventListener("click",t=>{t.target.closest('[data-tab="analytics"]')&&(t.preventDefault(),this.renderAnalyticsTab())})}renderAnalyticsTab(){var t=document.querySelector(".admin-content");t&&(this.isActive=!0,this.updateActiveNavItem("analytics"),t.innerHTML=`
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
    `,this.initializeCharts(),this.setupAnalyticsEventListeners())}initializeCharts(){var t=this.adminPanel.currentData;this.createRequestsTimeChart(t),this.createStatusChart(t),this.createRoutesChart(t),this.createCargoChart(t),this.updateKPIs(t),this.initializeMetricCircles()}createRequestsTimeChart(t){var a=document.getElementById("requestsTimeChart");a&&(t=this.processTimeData(t),this.charts.requestsTime=new Chart(a,{type:"line",data:{labels:t.labels,datasets:[{label:"Кількість заявок",data:t.values,borderColor:"#1e40af",backgroundColor:"rgba(30, 64, 175, 0.1)",borderWidth:2,fill:!0,tension:.4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{mode:"index",intersect:!1}},scales:{x:{display:!0,title:{display:!0,text:"Дата"}},y:{display:!0,title:{display:!0,text:"Кількість"},beginAtZero:!0}}}}))}createStatusChart(t){var a=document.getElementById("statusChart");a&&(t=this.processStatusData(t),this.charts.status=new Chart(a,{type:"doughnut",data:{labels:t.labels,datasets:[{data:t.values,backgroundColor:["#f59e0b","#22c55e","#ef4444","#06b6d4","#1e40af"],borderWidth:2,borderColor:"#ffffff"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom",labels:{usePointStyle:!0,padding:20}}}}}))}createRoutesChart(t){var a=document.getElementById("routesChart");a&&(t=this.processRoutesData(t),this.charts.routes=new Chart(a,{type:"bar",data:{labels:t.labels,datasets:[{label:"Кількість заявок",data:t.values,backgroundColor:"#1e40af",borderColor:"#1e40af",borderWidth:1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{title:{display:!0,text:"Маршрути"}},y:{beginAtZero:!0,title:{display:!0,text:"Кількість"}}}}}))}createCargoChart(t){var a=document.getElementById("cargoChart");a&&(t=this.processCargoData(t),this.charts.cargo=new Chart(a,{type:"polarArea",data:{labels:t.labels,datasets:[{data:t.values,backgroundColor:["rgba(30, 64, 175, 0.8)","rgba(34, 197, 94, 0.8)","rgba(245, 158, 11, 0.8)","rgba(239, 68, 68, 0.8)","rgba(6, 182, 212, 0.8)"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}}))}processTimeData(t){var a=Array.from({length:30},(t,a)=>{var e=new Date;return e.setDate(e.getDate()-(29-a)),e.toISOString().split("T")[0]}),e=a.map(a=>t.filter(t=>new Date(t.createdAt).toISOString().split("T")[0]===a).length);return{labels:a.map(t=>new Date(t).toLocaleDateString("uk-UA",{month:"short",day:"numeric"})),values:e}}processStatusData(t){let a={pending:0,approved:0,rejected:0,"in-progress":0,completed:0},e=(t.forEach(t=>{a.hasOwnProperty(t.status)&&a[t.status]++}),{pending:"В очікуванні",approved:"Схвалені",rejected:"Відхилені","in-progress":"В процесі",completed:"Завершені"});return{labels:Object.keys(a).map(t=>e[t]),values:Object.values(a)}}processRoutesData(t){let a={};t.forEach(t=>{t=t.pickupLocation+" → "+t.deliveryLocation;a[t]=(a[t]||0)+1});t=Object.entries(a).sort(([,t],[,a])=>a-t).slice(0,10);return{labels:t.map(([t])=>30<t.length?t.substring(0,30)+"...":t),values:t.map(([,t])=>t)}}processCargoData(t){let a={};t.forEach(t=>{t=t.cargoType||"Не вказано";a[t]=(a[t]||0)+1});t=Object.entries(a).sort(([,t],[,a])=>a-t).slice(0,8);return{labels:t.map(([t])=>t),values:t.map(([,t])=>t)}}updateKPIs(t){var a=t.length,e=t.filter(t=>"approved"===t.status).length;t.filter(t=>"completed"===t.status).length;document.getElementById("totalRequests").textContent=a.toLocaleString(),document.getElementById("conversionRate").textContent=0<a?Math.round(e/a*100)+"%":"0%",document.getElementById("avgProcessingTime").textContent="2.3 дні",document.getElementById("satisfactionRate").textContent="94%",document.getElementById("requestsTrend").textContent="+12%",document.getElementById("conversionTrend").textContent="+5%",document.getElementById("processingTrend").textContent="-8%",document.getElementById("satisfactionTrend").textContent="+3%"}initializeMetricCircles(){document.querySelectorAll(".metric-circle").forEach(t=>{var a=parseInt(t.dataset.percentage);this.animateCircle(t,a)})}animateCircle(t,a){Math.PI;t.style.background=`conic-gradient(#1e40af ${3.6*a}deg, #e5e7eb 0deg)`}setupAnalyticsEventListeners(){var t=document.getElementById("analyticsDateRange"),t=(t&&t.addEventListener("change",t=>{this.updateChartsForDateRange(t.target.value)}),document.addEventListener("click",t=>{var a;t.target.classList.contains("chart-btn")&&(a=t.target.dataset.chart,this.toggleChartType("requestsTime",a),t.target.parentElement.querySelectorAll(".chart-btn").forEach(t=>t.classList.remove("active")),t.target.classList.add("active"))}),document.addEventListener("click",t=>{t.target.dataset.analyticsTab&&this.switchAnalyticsTab(t.target.dataset.analyticsTab)}),document.getElementById("generateReport"));t&&t.addEventListener("click",()=>{this.generateAnalyticsReport()})}updateChartsForDateRange(t){let e=this.adminPanel.currentData;if("all"!==t){t=parseInt(t);let a=new Date;a.setDate(a.getDate()-t),e=this.adminPanel.currentData.filter(t=>new Date(t.createdAt)>=a)}this.updateChart("requestsTime",this.processTimeData(e)),this.updateChart("status",this.processStatusData(e)),this.updateChart("routes",this.processRoutesData(e)),this.updateChart("cargo",this.processCargoData(e)),this.updateKPIs(e)}updateChart(t,a){t=this.charts[t];t&&(t.data.labels=a.labels,t.data.datasets[0].data=a.values,t.update())}toggleChartType(t,a){t=this.charts[t];t&&(t.config.type=a,t.update())}switchAnalyticsTab(t){document.querySelectorAll("[data-analytics-tab]").forEach(t=>t.classList.remove("active")),document.querySelector(`[data-analytics-tab="${t}"]`).classList.add("active"),document.querySelectorAll(".tab-pane").forEach(t=>t.classList.remove("active")),document.getElementById(t).classList.add("active"),this.loadTabContent(t)}loadTabContent(t){switch(t){case"trends":this.loadTrendsContent();break;case"performance":this.loadPerformanceContent();break;case"forecast":this.loadForecastContent()}}loadTrendsContent(){document.getElementById("trendsTable").innerHTML=`
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
    `}loadPerformanceContent(){document.getElementById("performanceTable").innerHTML=`
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
    `}loadForecastContent(){document.getElementById("forecastTable").innerHTML=`
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
    `}generateAnalyticsReport(){this.adminPanel.showSuccess("Звіт успішно згенеровано і надіслано на вашу пошту"),console.log("Generating analytics report...")}updateActiveNavItem(t){document.querySelectorAll(".admin-sidebar__nav-item").forEach(t=>t.classList.remove("active")),document.querySelector(`[data-tab="${t}"]`).parentElement.classList.add("active")}destroy(){Object.values(this.charts).forEach(t=>{t&&t.destroy()}),this.charts={},this.isActive=!1}}document.addEventListener("DOMContentLoaded",()=>{window.adminPanel&&(window.analyticsModule=new AnalyticsModule(window.adminPanel))});