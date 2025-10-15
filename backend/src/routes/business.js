import express from 'express';
import {
  getBusinessProfile,
  updateBusinessProfile,
  getBusinessCampaigns,
  updateCampaignAnalytics
} from '../controllers/businessController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All business routes require authentication and business role
router.use(protect);
router.use(authorize('business'));

// Business profile management
router.get('/profile', getBusinessProfile);
router.put('/profile', updateBusinessProfile);

// Business campaign management
router.get('/campaigns', getBusinessCampaigns);
router.patch('/campaigns/:campaignId/analytics', updateCampaignAnalytics);

export default router;
