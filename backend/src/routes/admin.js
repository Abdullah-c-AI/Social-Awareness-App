import express from 'express';
import { getCampaignsByStatus } from '../controllers/campaignController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Admin campaign management
router.get('/campaigns', getCampaignsByStatus);

export default router;
