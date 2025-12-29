import express from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  searchUsersByPhoneNumber,
  getUserById,
  getUserFriends,
  updateUserCurrency,
  addFriend,
  removeFriend,
  uploadContacts,
  updateUserProfile,
} from '../controllers/user.controller';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', getUsers);

// @route   GET /api/users/search
// @desc    Search users by phone number
// @access  Private
router.get('/search', searchUsersByPhoneNumber);

// @route   POST /api/users/:id/contacts
// @desc    Upload contacts and find matching users
// @access  Private
router.post('/:id/contacts', uploadContacts);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', getUserById);

// @route   GET /api/users/:id/friends
// @desc    Get friends of a user
// @access  Private
router.get('/:id/friends', getUserFriends);

// @route   PUT /api/users/:id/profile
// @desc    Update user profile (name, bio, email)
// @access  Private
router.put(
  '/:id/profile',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').optional().isEmail(),
    body('bio', 'Bio must be less than 500 characters')
      .optional()
      .isLength({ max: 500 }),
  ],
  updateUserProfile
);

// @route   PUT /api/users/:id/currency
// @desc    Update user currency preference
// @access  Private
router.put(
  '/:id/currency',
  [body('currency', 'Currency is required').not().isEmpty()],
  updateUserCurrency
);

// @route   POST /api/users/:id/friends
// @desc    Add friend
// @access  Private
router.post('/:id/friends', addFriend);

// @route   DELETE /api/users/:id/friends/:friendId
// @desc    Remove friend
// @access  Private
router.delete('/:id/friends/:friendId', removeFriend);

export default router;
