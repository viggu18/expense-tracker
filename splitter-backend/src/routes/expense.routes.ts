import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import {
  createExpense,
  getExpenses,
  getExpensesByGroup,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from '../controllers/expense.controller';

const router = express.Router();

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post(
  '/',
  [
    body('description', 'Description is required').not().isEmpty(),
    body('amount', 'Amount is required and must be a positive number').isFloat({
      min: 0.01,
    }),
    body('paidBy', 'Paid by user ID is required').not().isEmpty(),
    body('splits', 'Splits array is required').isArray({ min: 1 }),
    body('splits.*.user', 'User ID is required for each split').not().isEmpty(),
    body('splits.*.amount', 'Amount is required for each split').isFloat({
      min: 0,
    }),
  ],
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
  createExpense
);

// @route   GET /api/expenses
// @desc    Get all expenses for a user (global view)
// @access  Private
router.get('/', getExpenses);

// @route   GET /api/expenses/group/:groupId
// @desc    Get expenses by group
// @access  Private
router.get('/group/:groupId', getExpensesByGroup);

// @route   GET /api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', getExpenseById);

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put(
  '/:id',
  [
    body('description', 'Description is required').not().isEmpty(),
    body('amount', 'Amount is required and must be a positive number').isFloat({
      min: 0.01,
    }),
    body('paidBy', 'Paid by user ID is required').not().isEmpty(),
    body('splits', 'Splits array is required').isArray({ min: 1 }),
    body('splits.*.user', 'User ID is required for each split').not().isEmpty(),
    body('splits.*.amount', 'Amount is required for each split').isFloat({
      min: 0,
    }),
  ],
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
  updateExpense
);

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', deleteExpense);

export default router;
