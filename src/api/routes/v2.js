
'use strict';

const express = require('express');
const {riddle} = require('../../models/index.js');
const bearerHandler = require('../../auth/middleware/bearer.js');
const aclHandler = require('../../auth/middleware/acl.js');

const router = express.Router();

router.post('/riddle', bearerHandler, aclHandler('create'), handleCreateRiddle);
router.put('/riddle/:id', bearerHandler, aclHandler('update'), handleUpdateRiddle);
router.delete('/riddle/:id', bearerHandler, aclHandler('delete'), handleDeleteRiddle);

async function handleCreateRiddle(req, res) {
  try {
    let obj = req.body;
    let newRiddle = await riddle.create(obj);
    res.status(201).json(newRiddle);
  } catch (err) {
    console.error(err)
  }
}

async function handleUpdateRiddle(req, res) {
  try {
    const id = req.params.id;
    const obj = req.body;
    let updatedRiddle = await riddle.update(obj, {where: id});
    res.status(200).json(updatedRiddle);
  } catch (err) {
    console.error(err)
  }
}

async function handleDeleteRiddle(req, res) {
  try {
    let id = req.params.id;
    let deletedRiddle = await riddle.destroy({ where: { id }});
    res.status(200).json(deletedRiddle);
  } catch (err) {
    console.error(err)
  }
}

module.exports = router;