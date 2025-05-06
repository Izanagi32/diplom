const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
require('dotenv').config();

const sequelize = require('./db');
const Request = require('./models/Request');
const requestsRouter = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));  // HTTP request logging
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/requests', requestsRouter);

// Sync database and start server
sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => console.error('Failed to sync database:', err)); 