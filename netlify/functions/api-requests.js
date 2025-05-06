const { createClient } = require('@libsql/client');
const fetch = require('node-fetch');
require('dotenv').config();

const url = process.env.TURSO_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
const tgToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!url || !authToken) {
  console.error('Turso URL or auth token missing');
}

const client = createClient({ url, authToken });

const createTableSQL = `
CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pickupLocation TEXT NOT NULL,
  deliveryLocation TEXT NOT NULL,
  length REAL,
  width REAL,
  height REAL,
  weight REAL,
  quantity INTEGER,
  cargoType TEXT,
  adr BOOLEAN,
  adrClass TEXT,
  comment TEXT,
  pickupDate TEXT,
  contactName TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  createdAt TEXT
);
`;

exports.handler = async (event, context) => {
  // Ensure table exists on each invocation
  try {
    await client.execute(createTableSQL);
  } catch (err) {
    console.error('Error creating table:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }

  if (event.httpMethod === 'GET') {
    try {
      const result = await client.execute(
        'SELECT * FROM requests ORDER BY createdAt DESC'
      );
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.rows)
      };
    } catch (err) {
      console.error('Error fetching requests:', err);
      return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
    }
  }

  if (event.httpMethod === 'POST') {
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const {
      pickupLocation,
      deliveryLocation,
      length = 0,
      width = 0,
      height = 0,
      weight = 0,
      quantity = 0,
      cargoType,
      adr = false,
      adrClass,
      comment,
      pickupDate,
      contactName,
      phone,
      email
    } = data;

    const createdAt = new Date().toISOString();
    const insertSQL = `
      INSERT INTO requests (
        pickupLocation, deliveryLocation, length, width, height,
        weight, quantity, cargoType, adr, adrClass,
        comment, pickupDate, contactName, phone, email, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await client.execute(insertSQL, [
        pickupLocation,
        deliveryLocation,
        length,
        width,
        height,
        weight,
        quantity,
        cargoType,
        adr ? 1 : 0,
        adrClass,
        comment,
        pickupDate,
        contactName,
        phone,
        email,
        createdAt
      ]);
    } catch (err) {
      console.error('Error inserting request:', err);
      return { statusCode: 500, body: JSON.stringify({ success: false }) };
    }

    // Send Telegram notification
    if (tgToken && chatId) {
      const message = `Нова заявка від ${contactName} \n` +
                      `📍 Забір: ${pickupLocation} \n` +
                      `📦 Доставка: ${deliveryLocation} \n` +
                      `📐 Розміри: ${length}×${width}×${height} см \n` +
                      `⚖️ Вага: ${weight} кг, Кількість: ${quantity} \n` +
                      `🚚 Тип: ${cargoType || '-'} \n` +
                      `⚠️ ADR: ${adr ? adrClass : 'Ні'} \n` +
                      `📅 Дата: ${pickupDate || '-'} \n` +
                      `📝 Коментар: ${comment || '-'} \n` +
                      `📞 Телефон: ${phone}, ✉️ Email: ${email}`;
      try {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message })
        });
      } catch (err) {
        console.error('Error sending telegram message:', err);
      }
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
}; 