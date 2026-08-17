require('./setup');
const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const decisionRoutes = require('../routes/decisionRoutes');
const authRoutes = require('../routes/authRoutes');

// code below: whenever any code in this test file imports ../services/aiService, 
// don't use the real file - use this fake version instead.

jest.mock('../services/aiService', () => ({
  getDecisionAnalysis: jest.fn().mockResolvedValue({
    title: 'Test option A or Test option B?',
    situation: 'Mock situation text.',
    tradeoff: 'Mock tradeoff text.',
    avoidanceCheck: 'Mock avoidance check text.',
    recommendation: 'Mock recommendation text.',
    recommendedChoice: 'Test option A',
  }),
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/decisions', decisionRoutes);

describe('POST /api/decisions', () => {
  it('should create a decision with a mocked AI response', async () => {
    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'decisiontest@example.com',
        password: 'password123',
      });

    const token = signupResponse.body.token;

    const response = await request(app)
      .post('/api/decisions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        choiceA: 'Test option A',
        choiceB: 'Test option B',
        description: 'Some test context here.',
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test option A or Test option B?');
    expect(response.body.recommendedChoice).toBe('Test option A');
    expect(response.body.choiceA).toBe('Test option A');
  });
});