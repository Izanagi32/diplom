const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database.sqlite';
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

module.exports = sequelize; 