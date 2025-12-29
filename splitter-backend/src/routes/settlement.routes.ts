import express from 'express';
import { body } from 'express-validator';
import {
  createSettlement,
  getSettlements,
  getSettlementsByGroup,
  getSettlementById,
  updateSettlement,
  deleteSettlement,
} from '../controllers/settlement.controller';

const router = express.Router();

// @route   POST /api/settlements
// @desc    Create a new settlement
// @access  Private
router.post(
  '/',
  [
    body('from', 'From user ID is required').not().isEmpty(),
    body('to', 'To user ID is required').not().isEmpty(),
    body('amount', 'Amount is required and must be a positive number').isFloat({
      min: 0.01,
    }),
  ],
  createSettlement
);

// @route   GET /api/settlements
// @desc    Get all settlements for a user
// @access  Private
router.get('/', getSettlements);

// @route   GET /api/settlements/group/:groupId
// @desc    Get settlements by group
// @access  Private
router.get('/group/:groupId', getSettlementsByGroup);

// @route   GET /api/settlements/:id
// @desc    Get settlement by ID
// @access  Private
router.get('/:id', getSettlementById);

// @route   PUT /api/settlements/:id
// @desc    Update settlement
// @access  Private
router.put(
  '/:id',
  [
    body('from', 'From user ID is required').not().isEmpty(),
    body('to', 'To user ID is required').not().isEmpty(),
    body('amount', 'Amount is required and must be a positive number').isFloat({
      min: 0.01,
    }),
  ],
  updateSettlement
);

// @route   DELETE /api/settlements/:id
// @desc    Delete settlement
// @access  Private
router.delete('/:id', deleteSettlement);

export default router;
