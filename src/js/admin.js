class AdminPanel{constructor(){this.currentData=[],this.filteredData=[],this.currentPage=1,this.itemsPerPage=10,this.sortColumn=null,this.sortDirection="asc",this.filters={status:"",dateFrom:"",dateTo:"",search:""},this.init()}async init(){this.checkAuthentication()?(this.setupEventListeners(),this.setupLogout(),await this.loadRequests(),this.renderStats()):window.location.href="./admin-login.html"}checkAuthentication(){var e="true"===localStorage.getItem("adminLoggedIn"),t="true"===sessionStorage.getItem("adminLoggedIn");return e?(e=localStorage.getItem("adminLoginTime"),Date.now()-parseInt(e,10)<6048e5||(localStorage.removeItem("adminLoggedIn"),localStorage.removeItem("adminLoginTime"),!1)):t}setupLogout(){var e,t=document.querySelector(".admin-header__user");t&&((e=document.createElement("button")).className="admin-header__logout",e.innerHTML='<i class="fas fa-sign-out-alt"></i> Вийти',e.addEventListener("click",()=>{confirm("Ви впевнені, що хочете вийти?")&&(localStorage.removeItem("adminLoggedIn"),localStorage.removeItem("adminLoginTime"),sessionStorage.removeItem("adminLoggedIn"),window.location.href="./admin-login.html")}),t.appendChild(e))}setupEventListeners(){var e=document.getElementById("searchRequests"),e=(e&&e.addEventListener("input",e=>{this.filters.search=e.target.value,this.applyFilters()}),document.getElementById("itemsPerPage")),e=(e&&e.addEventListener("change",e=>{this.itemsPerPage=parseInt(e.target.value),this.currentPage=1,this.renderTable(),this.renderPagination()}),this.setupFilterListeners(),this.setupBulkActions(),document.querySelector('[data-action="export"]'));e&&e.addEventListener("click",()=>this.exportData())}setupFilterListeners(){var e=document.getElementById("statusFilter"),t=document.getElementById("dateFromFilter"),a=document.getElementById("dateToFilter");e&&e.addEventListener("change",e=>{this.filters.status=e.target.value,this.applyFilters()}),t&&t.addEventListener("change",e=>{this.filters.dateFrom=e.target.value,this.applyFilters()}),a&&a.addEventListener("change",e=>{this.filters.dateTo=e.target.value,this.applyFilters()})}setupBulkActions(){var e=document.getElementById("selectAll");e&&e.addEventListener("change",t=>{document.querySelectorAll(".row-checkbox").forEach(e=>e.checked=t.target.checked),this.updateBulkActions()})}updateBulkActions(){var e=document.querySelectorAll(".row-checkbox:checked").length,t=document.getElementById("bulkActions");t&&(0<e?(t.style.display="flex",t.querySelector(".selected-count").textContent=e):t.style.display="none")}async loadRequests(){try{this.showLoading();var e=await fetch("/api/requests");if(!e.ok)throw new Error("HTTP error! status: "+e.status);var t=await e.json();if(!Array.isArray(t))throw new Error("Invalid data format received");this.currentData=t.map(e=>({...e,status:e.status||"pending",priority:e.priority||"medium"})),this.filteredData=[...this.currentData],this.renderTable(),this.renderPagination(),this.hideError()}catch(e){console.error("Error loading requests:",e),this.showError("Помилка завантаження заявок: "+e.message)}finally{this.hideLoading()}}applyFilters(){this.filteredData=this.currentData.filter(e=>{if(this.filters.search){let t=this.filters.search.toLowerCase();if(![e.pickupLocation,e.deliveryLocation,e.contactName,e.phone,e.email,e.cargoType,e.comment].map(e=>(e||"").toLowerCase()).some(e=>e.includes(t)))return!1}if(this.filters.status&&e.status!==this.filters.status)return!1;if(this.filters.dateFrom||this.filters.dateTo){e=new Date(e.createdAt);if(this.filters.dateFrom&&e<new Date(this.filters.dateFrom))return!1;if(this.filters.dateTo&&e>new Date(this.filters.dateTo))return!1}return!0}),this.currentPage=1,this.renderTable(),this.renderPagination()}sortData(s){this.sortColumn===s?this.sortDirection="asc"===this.sortDirection?"desc":"asc":(this.sortColumn=s,this.sortDirection="asc"),this.filteredData.sort((e,t)=>{let a=e[s],i=t[s];return"string"==typeof a&&(a=a.toLowerCase(),i=i.toLowerCase()),a<i?"asc"===this.sortDirection?-1:1:a>i?"asc"===this.sortDirection?1:-1:0}),this.renderTable(),this.updateSortHeaders()}updateSortHeaders(){document.querySelectorAll(".admin-table thead th.sortable").forEach(e=>{e.classList.remove("sort-asc","sort-desc"),e.dataset.column===this.sortColumn&&e.classList.add("sort-"+this.sortDirection)})}renderStats(){var e=this.calculateStats(),t=document.getElementById("statsContainer");t&&(t.innerHTML=`
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card__header">
              <h4>Всього заявок</h4>
              <div class="icon icon--primary">
                <i class="fas fa-clipboard-list"></i>
              </div>
            </div>
            <div class="stat-card__value">${e.total}</div>
            <div class="stat-card__change stat-card__change--positive">
              +${e.newToday} сьогодні
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card__header">
              <h4>В очікуванні</h4>
              <div class="icon icon--warning">
                <i class="fas fa-clock"></i>
              </div>
            </div>
            <div class="stat-card__value">${e.pending}</div>
            <div class="stat-card__change">
              ${(e.pending/e.total*100).toFixed(1)}% від загальної кількості
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card__header">
              <h4>Схвалені</h4>
              <div class="icon icon--success">
                <i class="fas fa-check-circle"></i>
              </div>
            </div>
            <div class="stat-card__value">${e.approved}</div>
            <div class="stat-card__change stat-card__change--positive">
              ${(e.approved/e.total*100).toFixed(1)}% від загальної кількості
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card__header">
              <h4>Завершені</h4>
              <div class="icon icon--primary">
                <i class="fas fa-truck"></i>
              </div>
            </div>
            <div class="stat-card__value">${e.completed}</div>
            <div class="stat-card__change stat-card__change--positive">
              ${(e.completed/e.total*100).toFixed(1)}% від загальної кількості
            </div>
          </div>
        </div>
      `)}calculateStats(){let t=(new Date).toDateString();return{total:this.currentData.length,pending:this.currentData.filter(e=>"pending"===e.status).length,approved:this.currentData.filter(e=>"approved"===e.status).length,completed:this.currentData.filter(e=>"completed"===e.status).length,newToday:this.currentData.filter(e=>new Date(e.createdAt).toDateString()===t).length}}renderTable(){let t=document.querySelector("#requests-table tbody");var e,a;t&&(e=(a=(this.currentPage-1)*this.itemsPerPage)+this.itemsPerPage,a=this.filteredData.slice(a,e),t.innerHTML="",0===a.length?t.innerHTML=`
        <tr>
          <td colspan="11" style="text-align: center; padding: 2rem;">
            <i class="fas fa-inbox" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
            <div>Заявки не знайдені</div>
          </td>
        </tr>
      `:a.forEach(e=>{e=this.createTableRow(e);t.appendChild(e)}))}createTableRow(e){var t=document.createElement("tr"),a=(t.dataset.id=e.id,this.formatDateTime(e.createdAt)),i=this.createStatusBadge(e.status),s=this.createPriorityBadge(e.priority);return t.innerHTML=`
      <td class="checkbox-cell">
        <input type="checkbox" class="row-checkbox" value="${e.id}">
      </td>
      <td>${e.id}</td>
      <td>
        <div><strong>Звідки:</strong> ${e.pickupLocation||"Не вказано"}</div>
        <div><strong>Куди:</strong> ${e.deliveryLocation||"Не вказано"}</div>
      </td>
      <td>${e.length}×${e.width}×${e.height}</td>
      <td>
        <div><strong>Вага:</strong> ${e.weight} кг</div>
        <div><strong>Кількість:</strong> ${e.quantity}</div>
      </td>
      <td>
        <div><strong>Тип:</strong> ${e.cargoType||"Не вказано"}</div>
        <div><strong>ADR:</strong> ${e.adr?"Так":"Ні"}</div>
        ${e.adr&&e.adrClass?`<div><strong>Клас:</strong> ${e.adrClass}</div>`:""}
      </td>
      <td class="comment-cell" title="${e.comment||""}">
        ${this.truncateText(e.comment||"Немає коментарів",50)}
      </td>
      <td>${e.pickupDate||"Не вказано"}</td>
      <td>
        <div><strong>${e.contactName||"Не вказано"}</strong></div>
        <div><i class="fas fa-phone"></i> ${e.phone||"Не вказано"}</div>
        <div><i class="fas fa-envelope"></i> ${e.email||"Не вказано"}</div>
      </td>
      <td>
        ${i}
        ${s}
      </td>
      <td>${a}</td>
      <td class="actions">
        <div class="btn-group">
          <button class="view-btn tooltip" data-tooltip="Переглянути" onclick="adminPanel.viewRequest(${e.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="edit-btn tooltip" data-tooltip="Редагувати" onclick="adminPanel.editRequest(${e.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="approve-btn tooltip" data-tooltip="Змінити статус" onclick="adminPanel.changeStatus(${e.id})">
            <i class="fas fa-check"></i>
          </button>
          <button class="delete-btn tooltip" data-tooltip="Видалити" onclick="adminPanel.deleteRequest(${e.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    `,t.querySelector(".row-checkbox").addEventListener("change",()=>this.updateBulkActions()),t}createStatusBadge(e){var t={pending:{class:"status-badge--pending",icon:"fas fa-clock",text:"В очікуванні"},approved:{class:"status-badge--approved",icon:"fas fa-check",text:"Схвалено"},rejected:{class:"status-badge--rejected",icon:"fas fa-times",text:"Відхилено"},"in-progress":{class:"status-badge--in-progress",icon:"fas fa-spinner",text:"В процесі"},completed:{class:"status-badge--completed",icon:"fas fa-check-circle",text:"Завершено"}},e=t[e]||t.pending;return`<div class="status-badge ${e.class}">
      <i class="${e.icon}"></i>
      ${e.text}
    </div>`}createPriorityBadge(e){var t={low:{class:"status-badge--approved",text:"Низький"},medium:{class:"status-badge--pending",text:"Середній"},high:{class:"status-badge--rejected",text:"Високий"}},e=t[e]||t.medium;return`<div class="status-badge ${e.class}" style="margin-top: 0.25rem;">
      ${e.text}
    </div>`}renderPagination(){var e,t,a=Math.ceil(this.filteredData.length/this.itemsPerPage),i=document.querySelector(".admin-pagination");i&&(e=(this.currentPage-1)*this.itemsPerPage+1,t=Math.min(this.currentPage*this.itemsPerPage,this.filteredData.length),i.innerHTML=`
      <div class="admin-pagination__info">
        Показано ${e}-${t} з ${this.filteredData.length} записів
      </div>
      <div class="admin-pagination__controls">
        <div class="admin-pagination__select">
          <label>Показати:</label>
          <select id="itemsPerPage">
            <option value="10" ${10===this.itemsPerPage?"selected":""}>10</option>
            <option value="25" ${25===this.itemsPerPage?"selected":""}>25</option>
            <option value="50" ${50===this.itemsPerPage?"selected":""}>50</option>
            <option value="100" ${100===this.itemsPerPage?"selected":""}>100</option>
          </select>
        </div>
        <button class="admin-pagination__button" ${1===this.currentPage?"disabled":""} onclick="adminPanel.goToPage(${this.currentPage-1})">
          <i class="fas fa-angle-left"></i>
        </button>
        <span class="admin-pagination__current">${this.currentPage}</span> з <span class="admin-pagination__total">${a}</span>
        <button class="admin-pagination__button" ${this.currentPage===a?"disabled":""} onclick="adminPanel.goToPage(${this.currentPage+1})">
          <i class="fas fa-angle-right"></i>
        </button>
      </div>
    `,i=document.getElementById("itemsPerPage"))&&i.addEventListener("change",e=>{this.itemsPerPage=parseInt(e.target.value),this.currentPage=1,this.renderTable(),this.renderPagination()})}goToPage(e){var t=Math.ceil(this.filteredData.length/this.itemsPerPage);1<=e&&e<=t&&(this.currentPage=e,this.renderTable(),this.renderPagination())}async viewRequest(t){var e=this.currentData.find(e=>e.id==t);e&&(e=this.createModal("large","Деталі заявки #"+t,this.createViewContent(e)),this.showModal(e))}async editRequest(t){var e=this.currentData.find(e=>e.id==t);e&&(e=this.createModal("medium","Редагування заявки #"+t,this.createEditForm(e)),this.showModal(e))}async changeStatus(t){var e=this.currentData.find(e=>e.id==t);e&&(e=this.createModal("small","Зміна статусу заявки #"+t,this.createStatusForm(e)),this.showModal(e))}async deleteRequest(t){if(confirm("Ви впевнені, що хочете видалити цю заявку? Цю дію неможливо скасувати."))try{this.showLoading();var e,a=await fetch("/api/requests?id="+t,{method:"DELETE"});if(!a.ok)throw e=await a.json(),new Error(e.error||"HTTP error! status: "+a.status);var i=await a.json();console.log("Delete result:",i),this.currentData=this.currentData.filter(e=>e.id!=t),this.applyFilters(),this.renderStats(),this.showSuccess("Заявку успішно видалено")}catch(e){console.error("Delete error:",e),this.showError("Помилка при видаленні заявки: "+e.message)}finally{this.hideLoading()}}createModal(e,t,a,i=null){var s=document.createElement("div"),r=(s.className="modal-overlay",document.createElement("div"));return r.className="modal modal--"+e,r.innerHTML=`
      <div class="modal__header">
        <h3>${t}</h3>
        <button class="close-btn" onclick="adminPanel.closeModal()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal__body">
        ${a}
      </div>
      ${i?`<div class="modal__footer">${i}</div>`:""}
    `,s.appendChild(r),s}showModal(t){document.body.appendChild(t),setTimeout(()=>t.classList.add("active"),10),t.addEventListener("click",e=>{e.target===t&&this.closeModal()}),document.addEventListener("keydown",this.handleEscapeKey)}closeModal(){let e=document.querySelector(".modal-overlay");e&&(e.classList.remove("active"),setTimeout(()=>e.remove(),300)),document.removeEventListener("keydown",this.handleEscapeKey)}handleEscapeKey=e=>{"Escape"===e.key&&this.closeModal()};createViewContent(e){return`
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <h4 style="margin-bottom: 1rem; color: #1e40af;">Інформація про маршрут</h4>
          <div class="form-group">
            <label>Звідки:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${e.pickupLocation||"Не вказано"}
            </div>
          </div>
          <div class="form-group">
            <label>Куди:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${e.deliveryLocation||"Не вказано"}
            </div>
          </div>
          <div class="form-group">
            <label>Дата подачі:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${e.pickupDate||"Не вказано"}
            </div>
          </div>
        </div>
        
        <div>
          <h4 style="margin-bottom: 1rem; color: #1e40af;">Характеристики вантажу</h4>
          <div class="form-group">
            <label>Розміри (Д×Ш×В):</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${e.length}×${e.width}×${e.height} м
            </div>
          </div>
          <div class="form-group">
            <label>Вага:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${e.weight} кг
            </div>
          </div>
          <div class="form-group">
            <label>Кількість:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${e.quantity}
            </div>
          </div>
          <div class="form-group">
            <label>Тип вантажу:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${e.cargoType||"Не вказано"}
            </div>
          </div>
          <div class="form-group">
            <label>ADR:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
              ${e.adr?"Так"+(e.adrClass?` (${e.adrClass})`:""):"Ні"}
            </div>
          </div>
        </div>
        
        <div style="grid-column: 1 / -1;">
          <h4 style="margin-bottom: 1rem; color: #1e40af;">Контактна інформація</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div class="form-group">
              <label>Ім'я:</label>
              <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
                ${e.contactName||"Не вказано"}
              </div>
            </div>
            <div class="form-group">
              <label>Телефон:</label>
              <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
                ${e.phone||"Не вказано"}
              </div>
            </div>
            <div class="form-group">
              <label>Email:</label>
              <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
                ${e.email||"Не вказано"}
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Коментар:</label>
            <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px; min-height: 60px;">
              ${e.comment||"Немає коментарів"}
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
            <div class="form-group">
              <label>Статус:</label>
              ${this.createStatusBadge(e.status)}
            </div>
            <div class="form-group">
              <label>Дата створення:</label>
              <div style="padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
                ${this.formatDateTime(e.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `}createEditForm(e){return`
      <form id="editRequestForm">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <div class="form-group">
            <label>Звідки: <span class="required">*</span></label>
            <input type="text" name="pickupLocation" value="${e.pickupLocation||""}" required>
          </div>
          
          <div class="form-group">
            <label>Куди: <span class="required">*</span></label>
            <input type="text" name="deliveryLocation" value="${e.deliveryLocation||""}" required>
          </div>
          
          <div class="form-group">
            <label>Дата подачі:</label>
            <input type="date" name="pickupDate" value="${e.pickupDate||""}">
          </div>
          
          <div class="form-group">
            <label>Тип вантажу:</label>
            <input type="text" name="cargoType" value="${e.cargoType||""}">
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
          <div class="form-group">
            <label>Довжина (м):</label>
            <input type="number" name="length" value="${e.length||""}" step="0.01" min="0">
          </div>
          
          <div class="form-group">
            <label>Ширина (м):</label>
            <input type="number" name="width" value="${e.width||""}" step="0.01" min="0">
          </div>
          
          <div class="form-group">
            <label>Висота (м):</label>
            <input type="number" name="height" value="${e.height||""}" step="0.01" min="0">
          </div>
          
          <div class="form-group">
            <label>Вага (кг):</label>
            <input type="number" name="weight" value="${e.weight||""}" step="0.01" min="0">
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label>Кількість:</label>
            <input type="number" name="quantity" value="${e.quantity||1}" min="1">
          </div>
          
          <div class="form-group">
            <label>ADR:</label>
            <select name="adr">
              <option value="false" ${e.adr?"":"selected"}>Ні</option>
              <option value="true" ${e.adr?"selected":""}>Так</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Клас ADR:</label>
            <input type="text" name="adrClass" value="${e.adrClass||""}">
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label>Ім'я контакту:</label>
            <input type="text" name="contactName" value="${e.contactName||""}">
          </div>
          
          <div class="form-group">
            <label>Телефон:</label>
            <input type="tel" name="phone" value="${e.phone||""}">
          </div>
          
          <div class="form-group">
            <label>Email:</label>
            <input type="email" name="email" value="${e.email||""}">
          </div>
        </div>
        
        <div class="form-group">
          <label>Коментар:</label>
          <textarea name="comment" rows="3">${e.comment||""}</textarea>
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
    `}createStatusForm(e){return`
      <form id="statusForm">
        <div class="form-group">
          <label>Поточний статус:</label>
          ${this.createStatusBadge(e.status)}
        </div>
        
        <div class="form-group">
          <label>Новий статус: <span class="required">*</span></label>
          <select name="status" required>
            <option value="pending" ${"pending"===e.status?"selected":""}>В очікуванні</option>
            <option value="approved" ${"approved"===e.status?"selected":""}>Схвалено</option>
            <option value="rejected" ${"rejected"===e.status?"selected":""}>Відхилено</option>
            <option value="in-progress" ${"in-progress"===e.status?"selected":""}>В процесі</option>
            <option value="completed" ${"completed"===e.status?"selected":""}>Завершено</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Пріоритет:</label>
          <select name="priority">
            <option value="low" ${"low"===e.priority?"selected":""}>Низький</option>
            <option value="medium" ${"medium"===e.priority?"selected":""}>Середній</option>
            <option value="high" ${"high"===e.priority?"selected":""}>Високий</option>
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
    `}formatDateTime(t){if(!t)return"Не вказано";try{let e;var a;return e=t.includes("+")||t.includes("T")?new Date(t):(a=t.replace(" ","T")+"Z",new Date(a)),isNaN(e.getTime())?(console.warn("Invalid date:",t),t):e.toLocaleString("uk-UA",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",timeZone:"Europe/Kiev"})}catch(e){return console.error("Date formatting error:",e,"for date:",t),t}}truncateText(e,t){return e?e.length<=t?e:e.substring(0,t)+"...":""}showLoading(){var e=document.querySelector(".admin-table-container");e&&e.classList.add("loading")}hideLoading(){var e=document.querySelector(".admin-table-container");e&&e.classList.remove("loading")}showError(e){this.showMessage(e,"error")}showSuccess(e){this.showMessage(e,"success")}showMessage(e,t="info"){let a=document.getElementById("error");a&&(a.className="admin-message admin-message--"+t,a.textContent=e,a.style.display="block",setTimeout(()=>{a.style.display="none"},5e3))}hideError(){var e=document.getElementById("error");e&&(e.style.display="none")}exportData(){var e=this.generateCSV(),e=new Blob([e],{type:"text/csv;charset=utf-8;"}),t=document.createElement("a");void 0!==t.download&&(e=URL.createObjectURL(e),t.setAttribute("href",e),t.setAttribute("download",`requests_export_${(new Date).toISOString().split("T")[0]}.csv`),t.style.visibility="hidden",document.body.appendChild(t),t.click(),document.body.removeChild(t))}generateCSV(){return[["ID","Звідки","Куди","Довжина","Ширина","Висота","Вага","Кількість","Тип вантажу","ADR","Клас ADR","Коментар","Дата подачі","Контактне ім'я","Телефон","Email","Статус","Створено"],...this.filteredData.map(e=>[e.id,e.pickupLocation||"",e.deliveryLocation||"",e.length||"",e.width||"",e.height||"",e.weight||"",e.quantity||"",e.cargoType||"",e.adr?"Так":"Ні",e.adrClass||"",(e.comment||"").replace(/"/g,'""'),e.pickupDate||"",e.contactName||"",e.phone||"",e.email||"",e.status||"",this.formatDateTime(e.createdAt)])].map(e=>e.map(e=>`"${e}"`).join(",")).join("\n")}}let adminPanel;async function handleEditSubmit(a){var e=new FormData(a),e=Object.fromEntries(e.entries());try{let t=parseInt(document.querySelector(".modal h3").textContent.match(/\d+/)[0]);var i,s=a.querySelector('button[type="submit"]'),r=(s.innerHTML,s.innerHTML='<i class="fas fa-spinner fa-spin"></i> Збереження...',s.disabled=!0,{id:t,pickupLocation:e.pickupLocation,deliveryLocation:e.deliveryLocation,length:parseFloat(e.length),width:parseFloat(e.width),height:parseFloat(e.height),weight:parseFloat(e.weight),quantity:parseInt(e.quantity),cargoType:e.cargoType,adr:"true"===e.adr,adrClass:e.adrClass,comment:e.comment,pickupDate:e.pickupDate,contactName:e.contactName,phone:e.phone,email:e.email}),n=await fetch("/api/requests",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!n.ok)throw i=await n.json(),new Error(i.error||"HTTP error! status: "+n.status);var d=await n.json(),o=(console.log("Edit update result:",d),adminPanel.currentData.findIndex(e=>e.id===t));-1!==o&&(adminPanel.currentData[o]={...adminPanel.currentData[o],...e,adr:"true"===e.adr,updatedAt:d.data.updatedAt},adminPanel.applyFilters(),adminPanel.closeModal(),adminPanel.showSuccess("Заявку успішно оновлено"))}catch(e){console.error("Edit update error:",e),adminPanel.showError("Помилка при оновленні заявки: "+e.message);s=a.querySelector('button[type="submit"]');s&&(s.innerHTML='<i class="fas fa-save"></i> Зберегти зміни',s.disabled=!1)}}async function handleStatusSubmit(a){var e=new FormData(a),e=Object.fromEntries(e.entries());try{let t=parseInt(document.querySelector(".modal h3").textContent.match(/\d+/)[0]);var i,s=a.querySelector('button[type="submit"]'),r=(s.innerHTML,s.innerHTML='<i class="fas fa-spinner fa-spin"></i> Оновлення...',s.disabled=!0,await fetch("/api/requests",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t,status:e.status,priority:e.priority,statusComment:e.statusComment})}));if(!r.ok)throw i=await r.json(),new Error(i.error||"HTTP error! status: "+r.status);var n=await r.json(),d=(console.log("Status update result:",n),adminPanel.currentData.findIndex(e=>e.id===t));-1!==d&&(adminPanel.currentData[d]={...adminPanel.currentData[d],status:e.status,priority:e.priority,statusComment:e.statusComment,updatedAt:n.data.updatedAt},adminPanel.applyFilters(),adminPanel.renderStats(),adminPanel.closeModal(),adminPanel.showSuccess("Статус заявки успішно оновлено"))}catch(e){console.error("Status update error:",e),adminPanel.showError("Помилка при оновленні статусу: "+e.message);s=a.querySelector('button[type="submit"]');s&&(s.innerHTML='<i class="fas fa-check"></i> Оновити статус',s.disabled=!1)}}document.addEventListener("DOMContentLoaded",()=>{adminPanel=new AdminPanel,document.addEventListener("submit",async e=>{"editRequestForm"===e.target.id?(e.preventDefault(),await handleEditSubmit(e.target)):"statusForm"===e.target.id&&(e.preventDefault(),await handleStatusSubmit(e.target))})});