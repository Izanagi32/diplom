const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const Request = require('../models/Request');

const router = express.Router();

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

    // Save to database
    const newReq = await Request.create({
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
    });

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

// Get all requests, sorted by newest first
router.get('/', async (req, res) => {
  try {
    const requests = await Request.findAll({ order: [['createdAt', 'DESC']] });
    res.json(requests);
  } catch (error) {
    console.error('Error in GET /api/requests:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router; 