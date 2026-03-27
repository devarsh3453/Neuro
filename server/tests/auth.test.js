const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('../index');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  
  const testEmail = 
    'jest_test_' + Date.now() + '@neurotrace.com';
  
  describe('POST /api/auth/register', () => {
    test('registers a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jest Test User',
          email: testEmail,
          password: 'Test1234',
          role: 'student'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testEmail);
      expect(res.body.user.role).toBe('student');
    });

    test('rejects duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jest Test User',
          email: testEmail,
          password: 'Test1234',
          role: 'student'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('rejects invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'notanemail',
          password: 'Test1234'
        });
      expect(res.statusCode).toBe(400);
    });

    test('rejects short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'new@test.com',
          password: '123'
        });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    test('logs in successfully with correct credentials',
      async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: testEmail,
            password: 'Test1234'
          });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
      });

    test('rejects wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'wrongpassword'
        });
      expect(res.statusCode).toBe(401);
    });

    test('rejects non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nobody@neurotrace.com',
          password: 'Test1234'
        });
      expect(res.statusCode).toBe(401);
    });
  });
});
