'use strict'
const { DataTypes } = require('sequelize');
const riddleModel = (sequelize, DataTypes) => {
  const riddle = sequelize.define('Riddles', {
    question: {
      type: DataTypes.TEXT,
      required: true,
    },
    answer: {
      type: DataTypes.STRING,
      required: true,
    },
    hint: {
      type: DataTypes.STRING,
      required: false,
    }
  });
}