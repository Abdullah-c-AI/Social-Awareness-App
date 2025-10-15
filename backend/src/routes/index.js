import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import postRoutes from './posts.js';
import campaignRoutes from './campaigns.js';
import adminRoutes from './admin.js';
import businessRoutes from './business.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/admin', adminRoutes);
router.use('/business', businessRoutes);

export default router;
