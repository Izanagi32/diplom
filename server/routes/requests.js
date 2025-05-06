const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const client = require('../db');

const router = express.Router();

// POST /api/requests: insert new request and send Telegram notification
router.post('/', async (req, res) => {
  try {
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
    } = req.body;

    const createdAt = new Date().toISOString();
    const insertSQL = `
      INSERT INTO requests (
        pickupLocation, deliveryLocation, length, width, height,
        weight, quantity, cargoType, adr, adrClass,
        comment, pickupDate, contactName, phone, email, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

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

    // Send Telegram notification
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = `Нова заявка від ${contactName} \n` +
                    `📍 Забір: ${pickupLocation} \n` +
                    `📦 Доставка: ${deliveryLocation} \n` +
                    `📐 Розміри: ${length || 0}×${width || 0}×${height || 0} см \n` +
                    `⚖️ Вага: ${weight || 0} кг, Кількість: ${quantity || 0} \n` +
                    `🚚 Тип: ${cargoType || '—'} \n` +
                    `⚠️ ADR: ${adr ? adrClass : 'Ні'} \n` +
                    `📅 Дата: ${pickupDate || '—'} \n` +
                    `📝 Коментар: ${comment || '—'} \n` +
                    `📞 Телефон: ${phone || '—'}, ✉️ Email: ${email || '—'}`;

    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/requests:', error);
    res.status(500).json({ success: false });
  }
});

// GET /api/requests: retrieve all requests sorted by createdAt DESC
router.get('/', async (req, res) => {
  try {
    const result = await client.execute(
      'SELECT * FROM requests ORDER BY createdAt DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error in GET /api/requests:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router; 