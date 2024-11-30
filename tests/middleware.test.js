import { protect } from '../middleware/middleware.js';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

jest.mock('jsonwebtoken'); // Mock JWT
jest.mock('../models/userModel.js'); // Mock User model

describe('Protect Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: { authorization: 'Bearer validtoken' } }; // Define req
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next() for a valid token and user', async () => {
    // Mock token verification and user data
    jwt.verify.mockReturnValue({ id: 'userId' });
    User.findById.mockResolvedValue({ _id: 'userId', username: 'testuser' });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', '1234'); // Mock secret matches
    expect(User.findById).toHaveBeenCalledWith('userId'); // Ensure User.findById is called
    expect(req.user).toEqual({ _id: 'userId', username: 'testuser' }); // Check req.user
    expect(next).toHaveBeenCalled(); // Ensure next() is called
  });

  it('should return 401 for an invalid token', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Not authorized, token failed',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    req.headers.authorization = null; // No authorization header

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Not authorized, no token',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
