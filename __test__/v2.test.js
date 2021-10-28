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
    writer: { username: 'writer', password: 'password', role: 'writer' },
    user: { username: 'user', password: 'password', role: 'user' },
  };

  Object.keys(users).forEach(async (userType) => {
    const response = await request.post('/signup').send(users[userType]);
    console.log(response.text);
  })
  
  it('POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item', async () => {
    const signResponse = await request.post('/signin')
      .auth('writer','password');

    const token = signResponse.body.token;

    console.log(token, '------------------------------------')

    let response = await request.post('/api/v2/clothes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'shirt',
        color: 'red',
        size: 'large',
      });
    
    expect(response.text).toContain('shirt');
  })

  it('GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items', async () => {
    const signResponse = await request.post('/signin')
      .auth('user','password');

    const token = signResponse.body.token;

    let response = await request.get('/api/v2/clothes')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.text).toContain('shirt');
  })

  it('GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID', async () => {
    const signResponse = await request.post('/signin')
      .auth('user','password');

    const token = signResponse.body.token;

    let response = await request.get('/api/v2/clothes/1')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.text).toContain('shirt');
  })

  it('PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID', async () => {
    const signResponse = await request.post('/signin')
      .auth('editor','password');

    const token = signResponse.body.token;

    let response = await request.put('/api/v2/clothes/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'pants',
      });
    
    expect(response.text).toContain('pants');
  })

  it('DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
    const signResponse = await request.post('/signin')
      .auth('admin','password');

    const token = signResponse.body.token;

    let response = await request.delete('/api/v2/clothes/1')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.text).toContain('1');

    let subsequentResponse = await request.get('/api/v2/clothes/1')
      .set('Authorization', `Bearer ${token}`);

    expect(subsequentResponse.text).toBe('null');
  })

})

