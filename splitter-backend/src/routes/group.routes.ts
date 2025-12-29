import express from 'express';
import { body } from 'express-validator';
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  promoteToAdmin,
  removeAdmin,
} from '../controllers/group.controller';

const router = express.Router();

// @route   POST /api/groups
// @desc    Create a new group
// @access  Private
router.post(
  '/',
  [
    body('name', 'Group name is required').not().isEmpty(),
    body('members', 'Members array is required').isArray({ min: 1 }),
  ],
  createGroup
);

// @route   GET /api/groups
// @desc    Get all groups for a user
// @access  Private
router.get('/', getGroups);

// @route   GET /api/groups/:id
// @desc    Get group by ID
// @access  Private
router.get('/:id', getGroupById);

// @route   PUT /api/groups/:id
// @desc    Update group
// @access  Private
router.put(
  '/:id',
  [body('name', 'Group name is required').not().isEmpty()],
  updateGroup
);

// @route   DELETE /api/groups/:id
// @desc    Delete group
// @access  Private
router.delete('/:id', deleteGroup);

// @route   POST /api/groups/:id/members
// @desc    Add member to group
// @access  Private
router.post('/:id/members', addMember);

// @route   DELETE /api/groups/:id/members/:userId
// @desc    Remove member from group
// @access  Private
router.delete('/:id/members/:userId', removeMember);

// @route   POST /api/groups/:id/admins
// @desc    Promote member to admin
// @access  Private
router.post('/:id/admins', promoteToAdmin);

// @route   DELETE /api/groups/:id/admins/:userId
// @desc    Remove admin privileges
// @access  Private
router.delete('/:id/admins/:userId', removeAdmin);

export default router;
