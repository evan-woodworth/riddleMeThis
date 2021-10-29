'use strict'

const riddleModel = (sequelize, DataTypes) => sequelize.define('Riddles', {
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hint: {
    type: DataTypes.STRING,
  }
});

module.exports = riddleModel;