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
    hint01: {
      type: DataTypes.STRING,
      required: false,
    },
    hint02: {
      type: DataTypes.STRING,
      required: false,
    },
    hint03: {
      type: DataTypes.STRING,
      required: false,
    },
  });
}