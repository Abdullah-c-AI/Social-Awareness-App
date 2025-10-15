import express from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  joinCampaign,
  leaveCampaign,
  updateCampaignStatus,
  getCampaignsByStatus,
  incrementCampaignView,
  incrementCampaignClick
} from '../controllers/campaignController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);

// Analytics tracking routes (public - no auth required)
router.post('/:id/view', incrementCampaignView);
router.post('/:id/click', incrementCampaignClick);

// Protected routes
router.post('/', protect, createCampaign);
router.put('/:id', protect, updateCampaign);
router.delete('/:id', protect, deleteCampaign);
router.post('/:id/join', protect, joinCampaign);
router.delete('/:id/join', protect, leaveCampaign);

// Admin-only routes
router.put('/:id/status', protect, authorize('admin'), updateCampaignStatus);

export default router;
