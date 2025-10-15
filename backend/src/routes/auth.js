import express from 'express';
import { register, login, logout, getProfile } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);

export default router;
