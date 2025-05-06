document.addEventListener('DOMContentLoaded', async () => {
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
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    errorDiv.textContent = 'Помилка завантаження заявок: ' + err.message;
  }
}); 