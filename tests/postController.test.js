import { addPost } from '../controllers/postController.js';
import Post from '../models/postModel.js';

jest.mock('../models/postModel.js'); // Mock Post model

describe('postController', () => {
  describe('addPost', () => {
    it('should add a post successfully', async () => {
      const req = { body: { title: 'Test Post', content: 'Content', sender: 'userId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockPost = { _id: 'postId', title: 'Test Post', content: 'Content', sender: 'userId' };

      // Mock the `Post` constructor and `save` method
      Post.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockPost), // Return mockPost when save is called
      }));

      await addPost(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return 500 for database errors', async () => {
      const req = { body: { title: 'Test Post', content: 'Content', sender: 'userId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simulate a save method throwing an error
      Post.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      }));

      await addPost(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});
