import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('phoneNumber', 'Please include a valid Indian phone number')
      .matches(/^[6-9]\d{9}$/)
      .withMessage(
        'Please include a valid Indian phone number (10 digits starting with 6-9)'
      ),
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  register
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('phoneNumber', 'Please include a valid Indian phone number')
      .matches(/^[6-9]\d{9}$/)
      .withMessage(
        'Please include a valid Indian phone number (10 digits starting with 6-9)'
      ),
    body('password', 'Password is required').exists(),
  ],
  login
);

// @route   GET /api/auth/me
// @desc    Get user profile
// @access  Private
router.get('/me', authMiddleware, getMe);

export default router;
