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

describe('Testing V1 routes', async () => {

  // establishing editor to seed data
  const userResponse = await request.post('/signup').send({ username: 'editor', password: 'password', role: 'editor' });

  const signResponse = await request.post('/signin')
    .auth('editor','password');

  const token = signResponse.body.token;

  let firstResponse = await request.post('/api/v2/riddle')
    .set('Authorization', `Bearer ${token}`)
    .send({
      question: 'A riddle?',
      answer: 'yes, a riddle',
      hint: '¯\_(ツ)_/¯',
    });

  let secondResponse = await request.post('/api/v2/riddle')
    .set('Authorization', `Bearer ${token}`)
    .send({
      question: 'A second riddle?',
      answer: 'yes, a second riddle',
      hint: '_/¯(ツ)¯\_',
    });

  it('GET /api/v1/riddle returns a riddle', async () => {
    let response = await request.get('/api/v1/riddle');
    console.log('-------Get /v1/riddle', response.text);
    expect(response.status).toBe(200);
  })

  it('GET /api/v1/riddle/:id returns a riddle by ID', async () => {
    let response = await request.get('/api/v1/riddle/1');
    console.log('-------Get /v1/riddle/:id', response.text);
    expect(response.status).toBe(200);
  })

  it('GET /api/v1/hint/:id returns a hint by riddle ID', async () => {
    let response = await request.get('/api/v1/hint/1');
    console.log('-------Get /v1/hint/:id', response.text);
    expect(response.status).toBe(200);
  })

  it('GET /api/v1/answer/:id returns an answer by riddle ID', async () => {
    let response = await request.get('/api/v1/answer/1');
    console.log('-------Get /v1/answer/:id', response.text);
    expect(response.status).toBe(200);
  })

})

