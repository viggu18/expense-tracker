import express from 'express';
import {
  getBalances,
  getGroupBalances,
} from '../controllers/balance.controller';

const router = express.Router();

// @route   GET /api/balances
// @desc    Get user's balances across all groups
// @access  Private
router.get('/', getBalances);

// @route   GET /api/balances/group/:groupId
// @desc    Get user's balances for a specific group
// @access  Private
router.get('/group/:groupId', getGroupBalances);

export default router;
