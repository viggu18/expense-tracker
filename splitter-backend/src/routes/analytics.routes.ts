import express from 'express';
import {
  getGroupAnalytics,
  getGlobalAnalytics,
} from '../controllers/analytics.controller';

const router = express.Router();

// @route   GET /api/analytics
// @desc    Get global analytics across all groups
// @access  Private
router.get('/', getGlobalAnalytics);

// @route   GET /api/analytics/group/:groupId
// @desc    Get analytics for a specific group
// @access  Private
router.get('/group/:groupId', getGroupAnalytics);

export default router;
