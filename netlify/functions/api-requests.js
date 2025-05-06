const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const fetch = require('node-fetch');

// Insert your Telegram credentials here
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID';

// Ensure data directory exists
const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'data.db');
const db = new Database(dbPath);

// Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pickupLocation TEXT,
    deliveryLocation TEXT,
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
    contactName TEXT,
    phone TEXT,
    email TEXT,
    createdAt TEXT
  )
`).run();

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body || '{}');
      const {
        pickupLocation,
        deliveryLocation,
        length,
        width,
        height,
        weight,
        quantity,
        cargoType,
        adr,
        adrClass,
        comment,
        pickupDate,
        contactName,
        phone,
        email
      } = data;
      const createdAt = new Date().toISOString();

      const stmt = db.prepare(`
        INSERT INTO requests (
          pickupLocation, deliveryLocation, length, width, height,
          weight, quantity, cargoType, adr, adrClass, comment,
          pickupDate, contactName, phone, email, createdAt
        ) VALUES (
          @pickupLocation, @deliveryLocation, @length, @width, @height,
          @weight, @quantity, @cargoType, @adr, @adrClass, @comment,
          @pickupDate, @contactName, @phone, @email, @createdAt
        )
      `);
      const result = stmt.run({
        pickupLocation,
        deliveryLocation,
        length,
        width,
        height,
        weight,
        quantity,
        cargoType,
        adr: adr ? 1 : 0,
        adrClass,
        comment,
        pickupDate,
        contactName,
        phone,
        email,
        createdAt
      });
      console.log('Inserted successfully:', result.lastInsertRowid);

      // Send Telegram notification
      const message = `
📦 New Delivery Request
🆔 ID: ${result.lastInsertRowid}
👤 Name: ${contactName}
📍 Pickup: ${pickupLocation}
📍 Delivery: ${deliveryLocation}
📅 Pickup Date: ${pickupDate}
📝 Comment: ${comment}
      `;
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message.trim()
        })
      });

      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, id: result.lastInsertRowid })
      };
    }

    if (event.httpMethod === 'GET') {
      const rows = db.prepare(`
        SELECT * FROM requests ORDER BY createdAt DESC
      `).all();
      return {
        statusCode: 200,
        body: JSON.stringify(rows)
      };
    }

    return {
      statusCode: 405,
      headers: { Allow: 'GET, POST' },
      body: 'Method Not Allowed'
    };
  } catch (error) {
    console.error('DB insert error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 