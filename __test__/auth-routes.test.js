'use strict';

require('dotenv');
const SECRET = process.env.SECRET;
const supertest = require('supertest');
const { server } = require('../src/server.js');
const { db } = require('../src/models/index.js');
const base64 = require('base-64');
const { expect } = require('@jest/globals')

const authRequest = supertest(server);

beforeAll(async (done) => {
  await db.sync();
  done();
});
afterAll(async (done) => {
  await db.drop();
  done();
});

describe('Testing Auth Routes', () => {
  
  it('Should create a new user on POST /signup', async () => {
    let response = await authRequest.post('/signup').send({
      username: 'Joe',
      password: 'test',
    });

    expect(response.status).toBe(201);
  })

  it('Should login a user on POST /signin', async () => {
    let encodedString = base64.encode('Joe:test');

    let response = await authRequest.post('/signin').set({
      Authorization: `Basic ${encodedString}`
    });

    expect(response.status).toBe(200)
  })

})

