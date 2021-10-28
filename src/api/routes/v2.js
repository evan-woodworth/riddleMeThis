
'use strict';

const express = require('express');
const dataModules = require('../../models');
const bearerHandler = require('../../auth/middleware/bearer.js');
const aclHandler = require('../../auth/middleware/acl.js');

const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', bearerHandler, aclHandler('read'), handleGetAll);
router.get('/:model/:id', bearerHandler, aclHandler('read'), handleGetOne);
router.post('/:model', bearerHandler, aclHandler('create'), handleCreate);
router.put('/:model/:id', bearerHandler, aclHandler('update'), handleUpdate);
router.delete('/:model/:id', bearerHandler, aclHandler('delete'), handleDelete);

async function handleGetAll(req, res) {
  try {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
  } catch (err) {
    console.error(err)
  }
}

async function handleGetOne(req, res) {
  try {
    const id = req.params.id;
    let theRecord = await req.model.get(id)
    res.status(200).json(theRecord);
  } catch (err) {
    console.error(err)
  }
}

async function handleCreate(req, res) {
  try {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error(err)
  }
}

async function handleUpdate(req, res) {
  try {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj)
    res.status(200).json(updatedRecord);
  } catch (err) {
    console.error(err)
  }
}

async function handleDelete(req, res) {
  try {
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(200).json(deletedRecord);
  } catch (err) {
    console.error(err)
  }
}


module.exports = router;