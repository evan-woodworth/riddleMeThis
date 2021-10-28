
'use strict';

const express = require('express');
const { riddles } = require('../../models');

const router = express.Router();

router.get('/riddle', handleGetRandomRiddle);
router.get('/riddle/:id', handleGetOneRiddle);
router.get('/hint/:id', handleGetHint);
router.get('/answer/:id', handleGetAnswer);

async function handleGetRandomRiddle(req, res) {
  try {
    let randomRiddle = await riddles.findOne({order: 'random()'});
    res.status(200).json(randomRiddle);
  } catch (err) {
    console.error(err)
  }
}

async function handleGetOneRiddle(req, res) {
  try {
    const id = req.params.id;
    let theRiddle = await riddles.findByPk(id);
    res.status(200).json(theRiddle);
  } catch (err) {
    console.error(err)
  }
}

async function handleGetHint(req, res) {
  try {
    const id = req.params.id;
    let theRiddle = await riddles.findByPk(id);
    let theHint = { hint: 'No hints available.' }
    if (theRiddle.hint) {
      theHint = theRiddle.hint;
    }
    res.status(200).json(theHint);
  } catch (err) {
    console.error(err)
  }
}

async function handleGetAnswer(req, res) {
  try {
    const id = req.params.id;
    let theRiddle = await riddles.findByPk(id);
    res.status(200).json(theRiddle.answer);
  } catch (err) {
    console.error(err)
  }
}

module.exports = router;