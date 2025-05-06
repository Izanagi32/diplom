# Logistics Server

This is the backend server for a logistics company. It uses:

- Express.js
- Sequelize (SQLite)
- dotenv
- node-fetch
- cors
- morgan (HTTP request logging)

## 🛠️ Setup

1. Open a terminal and navigate into the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment example and fill in your values:
   ```bash
   cp .env.example .env
   ```
   - `DB_PATH`: path to SQLite file (e.g. `./database.sqlite`)
   - `TELEGRAM_BOT_TOKEN`: your Telegram bot token
   - `TELEGRAM_CHAT_ID`: chat ID where notifications will be sent
4. Start the server:
   ```bash
   npm start
   ```

By default, the server runs on `http://localhost:3000`.

## 🚀 API Endpoints

### POST /api/requests

Create a new logistics request.

- **URL**: `/api/requests`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
  ```json
  {
    "pickupLocation": "Kyiv",
    "deliveryLocation": "Lviv",
    "length": 10,
    "width": 20,
    "height": 30,
    "weight": 5,
    "quantity": 2,
    "cargoType": "General",
    "adr": false,
    "adrClass": null,
    "comment": "Handle with care",
    "pickupDate": "2023-08-15",
    "contactName": "John Doe",
    "phone": "+380971112233",
    "email": "john@example.com"
  }
  ```
- **Success Response**:
  ```json
  { "success": true }
  ```
- **Error Response**:
  ```json
  { "success": false }
  ```

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": "Kyiv",
    "deliveryLocation": "Lviv",
    "contactName": "John Doe",
    "phone": "+380971112233",
    "email": "john@example.com"
  }'
```

### GET /api/requests

Retrieve all requests, sorted by newest first.

- **URL**: `/api/requests`
- **Method**: `GET`
- **Success Response**: Array of request objects:
  ```json
  [
    {
      "id": 1,
      "pickupLocation": "Kyiv",
      "deliveryLocation": "Lviv",
      "length": 10,
      "width": 20,
      "height": 30,
      "weight": 5,
      "quantity": 2,
      "cargoType": "General",
      "adr": false,
      "adrClass": null,
      "comment": "Handle with care",
      "pickupDate": "2023-08-15",
      "contactName": "John Doe",
      "phone": "+380971112233",
      "email": "john@example.com",
      "createdAt": "2023-08-01T12:34:56.000Z",
      "updatedAt": "2023-08-01T12:34:56.000Z"
    },
    ...
  ]
  ```

## 📦 Notes

- Server logs HTTP requests using `morgan` in `dev` format.
- Model validations ensure required fields and correct types.
- All requests trigger a Telegram notification via Bot API. 