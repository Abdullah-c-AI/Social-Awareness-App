import express from 'express';
import { 
  getPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost,
  likePost,
  unlikePost
} from '../controllers/postController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes
router.use(authenticateToken);

router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);
router.delete('/:id/like', unlikePost);

export default router;
