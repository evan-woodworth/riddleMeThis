'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./users.js');
const riddleModel = require('./riddle/model.js');

const options = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
} : {};

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite::memory';

const sequelize = new Sequelize(DATABASE_URL, options);
const users = userModel(sequelize, DataTypes);
const riddle = riddleModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  users,
  riddle,
}