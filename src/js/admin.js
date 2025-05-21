document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAuthentication()) {
    window.location.href = './admin-login.html';
    return;
  }
  
  setupLogout();

  const errorDiv = document.getElementById('error');
  try {
    const response = await fetch('/api/requests');
    if (!response.ok) throw new Error(`Статус запиту: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      errorDiv.textContent = 'Заявки не знайдені.';
      return;
    }
    const tbody = document.querySelector('#requests-table tbody');
    data.forEach(req => {
      const tr = document.createElement('tr');
      tr.appendChild(Object.assign(document.createElement('td'), { textContent: req.id }));
      tr.appendChild(Object.assign(document.createElement('td'), { textContent: `${req.pickupLocation} / ${req.deliveryLocation}` }));
      tr.appendChild(Object.assign(document.createElement('td'), { textContent: `${req.length}×${req.width}×${req.height}` }));
      tr.appendChild(Object.assign(document.createElement('td'), { textContent: `${req.weight} / ${req.quantity}` }));
      tr.appendChild(Object.assign(document.createElement('td'), { textContent: `${req.cargoType} / ${req.adr} / ${req.adrClass}` }));
      tr.appendChild(Object.assign(document.createElement('td'), { textContent: req.comment || '' }));
      tr.appendChild(Object.assign(document.createElement('td'), { textContent: req.pickupDate }));
      tr.appendChild(Object.assign(document.createElement('td'), { textContent: `${req.contactName}, ${req.phone}, ${req.email}` }));
      const rawTime = req.createdAt;
      const utcString = rawTime.replace(' ', 'T') + 'Z';
      const dateObj = new Date(utcString);
      const formattedTime = dateObj.toLocaleString('uk-UA', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      tr.appendChild(Object.assign(document.createElement('td'), { textContent: formattedTime }));
      
      // Add action buttons
      const actionsCell = document.createElement('td');
            
      const viewBtn = document.createElement('button');
      viewBtn.className = 'view-btn';
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
      viewBtn.title = 'Переглянути';
      viewBtn.addEventListener('click', () => viewRequest(req.id));
      
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.title = 'Редагувати';
      editBtn.addEventListener('click', () => editRequest(req.id));
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteBtn.title = 'Видалити';
      deleteBtn.addEventListener('click', () => deleteRequest(req.id));
      
      actionsCell.appendChild(viewBtn);
      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      
      tr.appendChild(actionsCell);
      
      tbody.appendChild(tr);
    });
    
    // Update pagination
    document.querySelector('.admin-pagination__total').textContent = Math.ceil(data.length / 10);
  } catch (err) {
    console.error(err);
    errorDiv.textContent = 'Помилка завантаження заявок: ' + err.message;
    errorDiv.style.display = 'block';
  }
  
  const searchInput = document.getElementById('searchRequests');
  if (searchInput) {
    searchInput.addEventListener('input', filterTable);
  }
}); 

function checkAuthentication() {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  const isSessionLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
  
  if (isLoggedIn) {
    const loginTime = localStorage.getItem('adminLoginTime');
    const now = Date.now();
    const loginTimeValue = parseInt(loginTime, 10);
    
    const expirationTime = 7 * 24 * 60 * 60 * 1000;
    
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

function setupLogout() {
  const userElement = document.querySelector('.admin-header__user');
  if (userElement) {
    const logoutButton = document.createElement('button');
    logoutButton.className = 'admin-header__logout';
    logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Вийти';
    
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminLoginTime');
      sessionStorage.removeItem('adminLoggedIn');
      
      window.location.href = './admin-login.html';
    });
    
    userElement.appendChild(logoutButton);
    
    const style = document.createElement('style');
    style.textContent = `
      .admin-header__logout {
        background-color: #ef4444;
        color: white;
        border: none;
        border-radius: 20px;
        padding: 0.5rem 1rem;
        font-family: inherit;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
      }
      
      .admin-header__logout:hover {
        background-color: #dc2626;
      }
    `;
    document.head.appendChild(style);
  }
}

function filterTable() {
  const searchInput = document.getElementById('searchRequests');
  const filter = searchInput.value.toUpperCase();
  const table = document.getElementById('requests-table');
  const rows = table.getElementsByTagName('tr');

  for (let i = 1; i < rows.length; i++) {
    let found = false;
    const cells = rows[i].getElementsByTagName('td');
    
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell && cell.textContent) {
        if (cell.textContent.toUpperCase().indexOf(filter) > -1) {
          found = true;
          break;
        }
      }
    }
    
    rows[i].style.display = found ? '' : 'none';
  }
}

function viewRequest(id) {
  alert(`Перегляд заявки #${id}`);
}

function editRequest(id) {
  alert(`Редагування заявки #${id}`);
}

function deleteRequest(id) {
  if (confirm(`Ви впевнені, що хочете видалити заявку #${id}?`)) {
    alert(`Заявка #${id} видалена`);
  }
} 