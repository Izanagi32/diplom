require('dotenv').config();
const { createClient } = require('@libsql/client');
const fetch = require('node-fetch');

// Initialize Turso client using environment variables
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

exports.handler = async function(event, context) {
  try {
    // Ensure the requests table exists
    await db.execute({
      sql: `
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
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `,
    });

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
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
        email,
      } = body;

      // Insert new request
      const insertResult = await db.execute({
        sql: `INSERT INTO requests (
          pickupLocation, deliveryLocation, length, width, height,
          weight, quantity, cargoType, adr, adrClass,
          comment, pickupDate, contactName, phone, email, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        args: [
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
        ],
      });
      const insertedId = insertResult.lastInsertRowid;

      // Send a Telegram notification
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      const message = `New logistics request received (ID: ${insertedId}):
Pickup: ${pickupLocation}
Delivery: ${deliveryLocation}
Dimensions: ${length}×${width}×${height}
Weight: ${weight}
Quantity: ${quantity}
Cargo Type: ${cargoType}
ADR: ${adr}
ADR Class: ${adrClass}
Pickup Date: ${pickupDate}
Contact: ${contactName}, ${phone}, ${email}
Comment: ${comment}`;

      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, id: insertedId.toString() }),
      };

    } else if (event.httpMethod === 'GET') {
      // Retrieve all requests
      const result = await db.execute({ sql: 'SELECT * FROM requests ORDER BY createdAt DESC' });
      const rows = result.rows.map(row => ({
        id: row.id instanceof BigInt ? row.id.toString() : row.id,
        pickupLocation: row.pickupLocation,
        deliveryLocation: row.deliveryLocation,
        length: row.length,
        width: row.width,
        height: row.height,
        weight: row.weight,
        quantity: row.quantity,
        cargoType: row.cargoType,
        adr: !!row.adr,
        adrClass: row.adrClass,
        comment: row.comment,
        pickupDate: row.pickupDate,
        contactName: row.contactName,
        phone: row.phone,
        email: row.email,
        createdAt: row.createdAt,
      }));

      return {
        statusCode: 200,
        body: JSON.stringify(rows),
      };

    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }
  } catch (error) {
    console.error('Function error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}; 