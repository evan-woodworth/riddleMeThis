'use strict';

require('dotenv');
const SECRET = process.env.SECRET;
const supertest = require('supertest');
const { server } = require('../src/server.js');
const { db } = require('../src/models/index.js');
const base64 = require('base-64');
const { expect } = require('@jest/globals');
const jwt = require('jsonwebtoken');

const request = supertest(server);

beforeAll(async (done) => {
  await db.sync();
  done();
});
afterAll(async (done) => {
  await db.drop();
  done();
});

describe('Testing V2 routes', () => {

  // establishing users with roles
  let users = {
    admin: { username: 'admin', password: 'password', role: 'admin' },
    editor: { username: 'editor', password: 'password', role: 'editor' },
  };

  Object.keys(users).forEach(async (userType) => {
    const response = await request.post('/signup').send(users[userType]);
    console.log(response.text, '------------------------');
  })
  
  it('POST /api/v2/riddle with a bearer token that has create permissions adds a riddle to the DB and returns an object with the riddle', async () => {
    const signResponse = await request.post('/signin')
      .auth('editor','password')
      .set('Authorization', 'Basic');

    const token = signResponse.body.token;
    console.log(token, '------------------------')

    let response = await request.post('/api/v2/riddle')
      .set('Authorization', `Bearer ${token}`)
      .send({
        question: 'A riddle?',
        answer: 'yes, a riddle',
        hint: '¯\_(ツ)_/¯',
      });
    
    expect(response.text).toContain('A riddle?');
  })

  it('PUT /api/v2/riddle/:id with a bearer token that has update permissions to return a single, updated riddle by ID', async () => {
    const signResponse = await request.post('/signin')
      .auth('editor','password');

    const token = signResponse.body.token;

    let response = await request.put('/api/v2/riddle/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        question: 'pants?',
      });
    
    expect(response.text).toContain('pants?');
  })

  it('DELETE /api/v2/riddle/:id with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
    const signResponse = await request.post('/signin')
      .auth('admin','password');

    const token = signResponse.body.token;

    let response = await request.delete('/api/v2/riddle/1')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.text).toContain('1');

    let subsequentResponse = await request.get('/api/v2/riddle/1')
      .set('Authorization', `Bearer ${token}`);

    expect(subsequentResponse.text).toBe('null');
  })

})

