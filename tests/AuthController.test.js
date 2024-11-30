import mongoose from 'mongoose';
import { register, login } from '../controllers/AuthController.js';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../models/userModel.js'); // Mock User model
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testDB');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('AuthController', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      User.findOne.mockResolvedValue(null); // No existing user
      bcrypt.hash.mockResolvedValue('hashedPassword'); // Mock password hashing
      User.prototype.save = jest.fn().mockResolvedValue({
        _id: 'userId',
        username: 'testuser',
        email: 'test@example.com',
      });

      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 'userId',
        username: 'testuser',
        email: 'test@example.com',
        token: expect.any(String),
      }));
    });
  });
});