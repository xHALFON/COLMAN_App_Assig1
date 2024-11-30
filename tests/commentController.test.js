import { createComment, getAllComments } from '../controllers/commentController.js';
import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';

jest.mock('../models/commentModel.js');
jest.mock('../models/postModel.js');

describe('commentController', () => {
  describe('createComment', () => {
    it('should create a comment successfully', async () => {
      const req = {
        body: { content: 'Nice post!', user: 'userId', postId: 'postId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const post = { _id: 'postId' };

      Post.findOne.mockResolvedValue(post);
      Comment.create.mockResolvedValue(req.body);

      await createComment(req, res);

      expect(Post.findOne).toHaveBeenCalledWith({ _id: 'postId' });
      expect(Comment.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });

  describe('getAllComments', () => {
    it('should return all comments', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const comments = [{ content: 'Test comment', user: 'userId' }];

      Comment.find.mockResolvedValue(comments);

      await getAllComments(req, res);

      expect(Comment.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(comments);
    });
  });
});
