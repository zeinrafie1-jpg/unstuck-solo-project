require('./setup');
const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

describe('POST /api/auth/signup', () => {
  it('should create a new user with valid input', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBe('test@example.com');
    expect(response.body.user.name).toBe('Test User');
    expect(response.body).toHaveProperty('token');
  });

  it('should reject signup with a duplicate email', async () => {
    // First signup — should succeed
    await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    // Second signup, same email — should be rejected
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Another User',
        email: 'duplicate@example.com',
        password: 'differentpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('An account with this email already exists');
  });
});