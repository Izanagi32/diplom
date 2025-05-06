const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
require('dotenv').config();

const client = require('./db');
const requestsRouter = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure requests table exists in Turso
(async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pickupLocation TEXT NOT NULL,
      deliveryLocation TEXT NOT NULL,
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
      contactName TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      createdAt TEXT
    );
  `;
  await client.execute(createTableSQL);
  console.log('Ensured requests table exists');
})().catch(err => {
  console.error('Error ensuring table exists:', err);
  process.exit(1);
});

// Middleware
app.use(morgan('dev'));  // HTTP request logging
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/requests', requestsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 