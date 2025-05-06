const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Request = sequelize.define('Request', {
  pickupLocation: { type: DataTypes.STRING, allowNull: false },
  deliveryLocation: { type: DataTypes.STRING, allowNull: false },
  length: { type: DataTypes.FLOAT, allowNull: true, validate: { min: 0 } },
  width: { type: DataTypes.FLOAT, allowNull: true, validate: { min: 0 } },
  height: { type: DataTypes.FLOAT, allowNull: true, validate: { min: 0 } },
  weight: { type: DataTypes.FLOAT, allowNull: true, validate: { min: 0 } },
  quantity: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1 } },
  cargoType: { type: DataTypes.STRING, allowNull: true },
  adr: { type: DataTypes.BOOLEAN, defaultValue: false },
  adrClass: { type: DataTypes.STRING, allowNull: true },
  comment: { type: DataTypes.TEXT, allowNull: true },
  pickupDate: { type: DataTypes.DATEONLY, allowNull: true },
  contactName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } }
}, {
  timestamps: true
});

module.exports = Request; 