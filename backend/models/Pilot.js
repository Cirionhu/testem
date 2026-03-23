const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pilot = sequelize.define('Pilot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  driver_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  given_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  family_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  permanent_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  wiki_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  last_synced_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'pilots',
  timestamps: true
});

module.exports = Pilot;