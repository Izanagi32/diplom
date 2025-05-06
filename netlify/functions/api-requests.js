require('dotenv').config();
const { createClient } = require('@libsql/client');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

exports.handler = async function(event, context) {
  try {
    // Log environment variables for Telegram to ensure they are set
    console.log('Telegram ENV >> BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN, 'CHAT_ID:', process.env.TELEGRAM_CHAT_ID);
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
      args: []
    });

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      console.log('POST /api/requests body:', body);
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

      let insertResult;
      try {
        insertResult = await db.execute({
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
        console.log('db.execute insertResult:', insertResult);
      } catch (error) {
        console.error('Insert failed:', error);
        throw error;
      }
      const insertedId = insertResult.lastInsertRowid;

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

      // Send Telegram notification via POST to avoid URL length issues
      try {
        console.log('Sending Telegram via POST');
        const telegramResponse = await fetch(
          'https://api.telegram.org/bot7378979804:AAGuviiwgUsrUprTP_NBm_wZn8iSH8l4a5U/sendMessage',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: 1693054209,
              text: message
            }),
          }
        );
        const telegramResult = await telegramResponse.json();
        console.log('Telegram API result:', telegramResult);
        if (!telegramResult.ok) console.error('Telegram send error:', telegramResult);
      } catch (err) {
        console.error('Error sending Telegram notification:', err);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, id: insertedId.toString() }),
      };

    } else if (event.httpMethod === 'GET') {
      const result = await db.execute({
        sql: 'SELECT * FROM requests ORDER BY createdAt DESC',
        args: []
      });
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