'use strict';

require('dotenv');
const SECRET = process.env.SECRET;
const supertest = require('supertest');
const { server } = require('../src/server.js');
const { db } = require('../src/models/index.js');
const base64 = require('base-64');
const { expect } = require('@jest/globals')

const request = supertest(server);

beforeAll(async (done) => {
  await db.sync();
  done();
});
afterAll(async (done) => {
  await db.drop();
  done();
});

describe('Testing V1 routes', () => {
  
  it('POST /api/v1/:model adds an item to the DB and returns an object with the added item', async () => {
    let response = await request.post('/api/v1/clothes').send({
      name: 'shirt',
      color: 'red',
      size: 'large',
    });
    expect(response.text).toContain('shirt');
  })

  it('GET /api/v1/:model returns a list of :model items', async () => {
    let response = await request.get('/api/v1/clothes');

    expect(response.text).toContain('shirt');
  })

  it('GET /api/v1/:model/ID returns a single item by ID', async () => {
    let response = await request.get('/api/v1/clothes/1');

    expect(response.text).toContain('shirt');
  })

  it('PUT /api/v1/:model/ID returns a single, updated item by ID', async () => {
    let response = await request.put('/api/v1/clothes/1').send({
      name: 'pants',
    });

    expect(response.text).toContain('pants');
  })

  it('DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
    let response = await request.delete('/api/v1/clothes/1');

    expect(response.text).toContain('1');
  })

})

