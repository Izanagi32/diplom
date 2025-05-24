require('dotenv').config();
const { createClient } = require('@libsql/client');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

exports.handler = async function(event, context) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Request details:', {
      method: event.httpMethod,
      path: event.path,
      headers: event.headers,
      body: event.body ? JSON.parse(event.body) : null
    });
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
          status TEXT DEFAULT 'pending',
          priority TEXT DEFAULT 'medium',
          assignedTo TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `,
      args: []
    });

    // Add new columns if they don't exist (for existing databases)
    try {
      await db.execute({
        sql: `ALTER TABLE requests ADD COLUMN status TEXT DEFAULT 'pending'`,
        args: []
      });
    } catch (e) {
      // Column already exists
    }
    
    try {
      await db.execute({
        sql: `ALTER TABLE requests ADD COLUMN priority TEXT DEFAULT 'medium'`,
        args: []
      });
    } catch (e) {
      // Column already exists
    }
    
    try {
      await db.execute({
        sql: `ALTER TABLE requests ADD COLUMN assignedTo TEXT`,
        args: []
      });
    } catch (e) {
      // Column already exists
    }
    
    try {
      await db.execute({
        sql: `ALTER TABLE requests ADD COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
        args: []
      });
    } catch (e) {
      // Column already exists
    }

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
            comment, pickupDate, contactName, phone, email, 
            status, priority, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
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
            'pending', // default status
            body.priority || 'medium' // priority from request or default
          ],
        });
        console.log('db.execute insertResult:', insertResult);
      } catch (error) {
        console.error('Insert failed:', error);
        throw error;
      }
      const insertedId = insertResult.lastInsertRowid;

      const fileNameToShow = 'немає';
      const volume = (length * width * height * quantity).toFixed(2);
      const message =
        `🚚 Нова заявка з форми\n\n` +
        `📍 Звідки: ${pickupLocation}\n` +
        `📍 Куди: ${deliveryLocation}\n\n` +
        `📅 Дата подачі: ${pickupDate}\n\n` +
        `📐 Габарити: ${length} x ${width} x ${height} м\n` +
        `📦 Кількість: ${quantity}\n` +
        `⚖️ Вага: ${weight} кг\n\n` +
        `Об'єм: ${volume} м³\n` +
        `📂 Тип вантажу: ${cargoType}\n\n` +
        `💬 Коментар: ${comment}\n\n` +
        `📞 Контакт: ${contactName}, ${phone}\n` +
        `✉️ Email: ${email}\n` +
        `📎 Файл: ${fileNameToShow}`;
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
        headers,
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
        status: row.status || 'pending',
        priority: row.priority || 'medium',
        assignedTo: row.assignedTo,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(rows),
      };

    } else if (event.httpMethod === 'PUT') {
      // Update request
      const pathParts = event.path.split('/');
      const requestId = pathParts[pathParts.length - 1];
      const body = JSON.parse(event.body);
      
      console.log('PUT /api/requests/:id body:', body, 'ID:', requestId);
      
      const updateFields = [];
      const updateValues = [];
      
      // Build dynamic update query based on provided fields
      Object.keys(body).forEach(key => {
        if (key !== 'id' && body[key] !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(body[key]);
        }
      });
      
      // Always update the updatedAt field
      updateFields.push('updatedAt = CURRENT_TIMESTAMP');
      updateValues.push(requestId);
      
      const updateResult = await db.execute({
        sql: `UPDATE requests SET ${updateFields.join(', ')} WHERE id = ?`,
        args: updateValues
      });
      
      if (updateResult.rowsAffected === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Request not found' }),
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, updated: true }),
      };

    } else if (event.httpMethod === 'DELETE') {
      // Delete request
      const pathParts = event.path.split('/');
      const requestId = pathParts[pathParts.length - 1];
      
      console.log('DELETE /api/requests/:id ID:', requestId, 'Path parts:', pathParts);
      
      if (!requestId || requestId === 'requests') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing request ID' }),
        };
      }
      
      const deleteResult = await db.execute({
        sql: 'DELETE FROM requests WHERE id = ?',
        args: [requestId]
      });
      
      console.log('Delete result:', deleteResult);
      
      if (deleteResult.rowsAffected === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Request not found' }),
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, deleted: true, id: requestId }),
      };

    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }
  } catch (error) {
    console.error('Function error', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}; 