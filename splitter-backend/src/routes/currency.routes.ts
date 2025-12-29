import express from 'express';
import { body } from 'express-validator';
import {
  getCurrencies,
  getCurrencyByCode,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} from '../controllers/currency.controller';

const router = express.Router();

// @route   GET /api/currencies
// @desc    Get all currencies
// @access  Public
router.get('/', getCurrencies);

// @route   GET /api/currencies/:code
// @desc    Get currency by code
// @access  Public
router.get('/:code', getCurrencyByCode);

// @route   POST /api/currencies
// @desc    Create currency
// @access  Private/Admin
router.post(
  '/',
  [
    body('code', 'Currency code is required').not().isEmpty(),
    body('name', 'Currency name is required').not().isEmpty(),
    body('symbol', 'Currency symbol is required').not().isEmpty(),
  ],
  createCurrency
);

// @route   PUT /api/currencies/:code
// @desc    Update currency
// @access  Private/Admin
router.put(
  '/:code',
  [
    body('name', 'Currency name is required').not().isEmpty(),
    body('symbol', 'Currency symbol is required').not().isEmpty(),
  ],
  updateCurrency
);

// @route   DELETE /api/currencies/:code
// @desc    Delete currency
// @access  Private/Admin
router.delete('/:code', deleteCurrency);

export default router;
