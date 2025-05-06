const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const fetch = require('node-fetch');
const os = require('os');

// Insert your Telegram credentials here
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID';

// Prepare data directory in writable tmp and DB file path
const dataDir = path.join(os.tmpdir(), 'netlify-data');
fs.mkdirSync(dataDir, { recursive: true });
const dbFilePath = path.join(dataDir, 'data.db');

// Initialize SQL.js (WASM) and load or create the SQLite database
const dbPromise = initSqlJs({
  // Locate wasm file locally in node_modules
  locateFile: file => path.join(__dirname, '../../node_modules/sql.js/dist/', file)
}).then(SQL => {
  const buffer = fs.existsSync(dbFilePath) ? fs.readFileSync(dbFilePath) : null;
  const db = new SQL.Database(buffer);
  // Create table if not exists
  db.run(`
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
  `);
  // Persist DB file
  fs.writeFileSync(dbFilePath, Buffer.from(db.export()));
  return db;
});

exports.handler = async (event) => {
  // Wait for DB initialization
  const db = await dbPromise;
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

      // Insert new request
      db.run(
        `INSERT INTO requests (
          pickupLocation, deliveryLocation, length, width, height,
          weight, quantity, cargoType, adr, adrClass, comment,
          pickupDate, contactName, phone, email, createdAt
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          pickupLocation, deliveryLocation, length, width, height,
          weight, quantity, cargoType, adr ? 1 : 0, adrClass, comment,
          pickupDate, contactName, phone, email, createdAt
        ]
      );
      // Persist DB changes
      fs.writeFileSync(dbFilePath, Buffer.from(db.export()));

      // Send Telegram notification
      const message = `
📦 New Delivery Request
🆔 ID: ${db.get(`SELECT last_insert_rowid() AS id`).get().id}
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
        body: JSON.stringify({ success: true })
      };
    }

    if (event.httpMethod === 'GET') {
      // Query all requests
      const resArr = db.exec('SELECT * FROM requests ORDER BY createdAt DESC');
      let rows = [];
      if (resArr.length) {
        const { columns, values } = resArr[0];
        rows = values.map(row => {
          const obj = {};
          row.forEach((val, idx) => { obj[columns[idx]] = val; });
          return obj;
        });
      }
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