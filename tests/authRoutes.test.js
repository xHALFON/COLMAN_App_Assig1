import app from '../index.js';
import mongoose from 'mongoose';
import request from 'supertest';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testDB');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    it('should return 201 for successful registration', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 400 for an existing user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'existinguser',
          email: 'existing@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });
}); 