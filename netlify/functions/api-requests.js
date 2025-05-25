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
        status: row.status || 'pending',
        priority: row.priority || 'medium',
        statusComment: row.status_comment,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return {
        statusCode: 200,
        body: JSON.stringify(rows),
      };

    } else if (event.httpMethod === 'PUT') {
      // Оновлення заявки (статус, пріоритет тощо)
      const body = JSON.parse(event.body);
      console.log('PUT /api/requests body:', body);
      const { id, ...updateData } = body;

      if (!id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'ID is required for update' }),
        };
      }

      try {
        // Перетворення назв полів для Supabase
        const supabaseData = {};
        if (updateData.status !== undefined) supabaseData.status = updateData.status;
        if (updateData.priority !== undefined) supabaseData.priority = updateData.priority;
        if (updateData.statusComment !== undefined) supabaseData.status_comment = updateData.statusComment;
        if (updateData.pickupLocation !== undefined) supabaseData.pickup_location = updateData.pickupLocation;
        if (updateData.deliveryLocation !== undefined) supabaseData.delivery_location = updateData.deliveryLocation;
        if (updateData.length !== undefined) supabaseData.length = updateData.length;
        if (updateData.width !== undefined) supabaseData.width = updateData.width;
        if (updateData.height !== undefined) supabaseData.height = updateData.height;
        if (updateData.weight !== undefined) supabaseData.weight = updateData.weight;
        if (updateData.quantity !== undefined) supabaseData.quantity = updateData.quantity;
        if (updateData.cargoType !== undefined) supabaseData.cargo_type = updateData.cargoType;
        if (updateData.adr !== undefined) supabaseData.adr = updateData.adr;
        if (updateData.adrClass !== undefined) supabaseData.adr_class = updateData.adrClass;
        if (updateData.comment !== undefined) supabaseData.comment = updateData.comment;
        if (updateData.pickupDate !== undefined) supabaseData.pickup_date = updateData.pickupDate;
        if (updateData.contactName !== undefined) supabaseData.contact_name = updateData.contactName;
        if (updateData.phone !== undefined) supabaseData.phone = updateData.phone;
        if (updateData.email !== undefined) supabaseData.email = updateData.email;

        const { data, error } = await supabase
          .from('requests')
          .update(supabaseData)
          .eq('id', id)
          .select();

        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Request not found' }),
          };
        }

        console.log('Supabase update result:', data[0]);

        return {
          statusCode: 200,
          body: JSON.stringify({ 
            success: true, 
            data: {
              id: data[0].id,
              status: data[0].status,
              priority: data[0].priority,
              statusComment: data[0].status_comment,
              updatedAt: data[0].updated_at
            }
          }),
        };

      } catch (error) {
        console.error('Update failed:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
        };
      }

    } else if (event.httpMethod === 'DELETE') {
      // Видалення заявки
      const url = new URL(event.rawUrl || `https://example.com${event.path}`);
      const id = url.searchParams.get('id');

      if (!id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'ID is required for delete' }),
        };
      }

      try {
        const { data, error } = await supabase
          .from('requests')
          .delete()
          .eq('id', id)
          .select();

        if (error) {
          console.error('Supabase delete error:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Request not found' }),
          };
        }

        console.log('Supabase delete result:', data[0]);

        return {
          statusCode: 200,
          body: JSON.stringify({ 
            success: true, 
            message: 'Request deleted successfully',
            deletedId: id
          }),
        };

      } catch (error) {
        console.error('Delete failed:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
        };
      }

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