require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Ініціалізація Supabase клієнта
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async function(event, context) {
  try {
    console.log('Telegram ENV >> BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN, 'CHAT_ID:', process.env.TELEGRAM_CHAT_ID);
    
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
        // Вставка даних в Supabase
        const { data, error } = await supabase
          .from('requests')
          .insert([
            {
              pickup_location: pickupLocation,
              delivery_location: deliveryLocation,
              length: length,
              width: width,
              height: height,
              weight: weight,
              quantity: quantity,
              cargo_type: cargoType,
              adr: adr,
              adr_class: adrClass,
              comment: comment,
              pickup_date: pickupDate,
              contact_name: contactName,
              phone: phone,
              email: email,
              created_at: new Date().toISOString()
            }
          ])
          .select();

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }

        insertResult = data[0];
        console.log('Supabase insert result:', insertResult);
      } catch (error) {
        console.error('Insert failed:', error);
        throw error;
      }

      const insertedId = insertResult.id;
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
        body: JSON.stringify({ success: true, id: insertedId.toString() }),
      };

    } else if (event.httpMethod === 'GET') {
      // Отримання всіх заявок з Supabase
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase select error:', error);
        throw error;
      }

      // Перетворення назв полів для сумісності з фронтендом
      const rows = data.map(row => ({
        id: row.id,
        pickupLocation: row.pickup_location,
        deliveryLocation: row.delivery_location,
        length: row.length,
        width: row.width,
        height: row.height,
        weight: row.weight,
        quantity: row.quantity,
        cargoType: row.cargo_type,
        adr: row.adr,
        adrClass: row.adr_class,
        comment: row.comment,
        pickupDate: row.pickup_date,
        contactName: row.contact_name,
        phone: row.phone,
        email: row.email,
        createdAt: row.created_at,
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