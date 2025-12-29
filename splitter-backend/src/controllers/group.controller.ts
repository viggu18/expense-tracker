import { Request, Response } from 'express';
import Group, { IGroup } from '../models/Group';
import User from '../models/User';
import { validationResult } from 'express-validator';

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
export const createGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, description, members = [] } = req.body;

    // Ensure the creator is added as both admin and member, but avoid duplicates
    const creatorId = req.user?._id.toString();

    // Filter out the creator from the members array if they're already there
    const filteredMembers = members.filter(
      (memberId: string) => memberId !== creatorId
    );

    // Create group with current user as admin and member (without duplicates)
    const group = new Group({
      name,
      description,
      members: [creatorId, ...filteredMembers],
      admins: [creatorId],
    });

    const createdGroup = await group.save();
    res.status(201).json(createdGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all groups for a user
// @route   GET /api/groups
// @access  Private
export const getGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const groups = await Group.find({ members: req.user?._id });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Private
export const getGroupById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name phoneNumber')
      .populate('admins', 'name phoneNumber');

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Check if user is member of the group
    if (
      !group.members.some(
        member => member._id.toString() === req.user?._id.toString()
      )
    ) {
      res.status(401).json({ message: 'Not authorized to access this group' });
      return;
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update group
// @route   PUT /api/groups/:id
// @access  Private
export const updateGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, description, members } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Check if user is admin of the group
    if (
      !group.admins.some(admin => admin.toString() === req.user?._id.toString())
    ) {
      res.status(401).json({ message: 'Not authorized to update this group' });
      return;
    }

    // Update group
    group.name = name || group.name;
    group.description = description || group.description;

    // Handle members update - ensure no duplicates and include admin
    if (members) {
      const creatorId = req.user?._id.toString();
      const filteredMembers = members.filter(
        (memberId: string) => memberId !== creatorId
      );
      group.members = [...new Set([creatorId, ...filteredMembers])];
    }

    const updatedGroup = await group.save();
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Private
export const deleteGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Check if user is admin of the group
    if (
      !group.admins.some(admin => admin.toString() === req.user?._id.toString())
    ) {
      res.status(401).json({ message: 'Not authorized to delete this group' });
      return;
    }

    await group.deleteOne();
    res.json({ message: 'Group removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add member to group
// @route   POST /api/groups/:id/members
// @access  Private
export const addMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const group = await Group.findById(req.params.id);
    const user = await User.findById(req.body.userId);

    if (!group || !user) {
      res.status(404).json({ message: 'Group or user not found' });
      return;
    }

    // Check if user is admin of the group
    if (
      !group.admins.some(admin => admin.toString() === req.user?._id.toString())
    ) {
      res
        .status(401)
        .json({ message: 'Not authorized to add members to this group' });
      return;
    }

    // Check if user is already a member
    if (
      group.members.some(member => member.toString() === user._id.toString())
    ) {
      res
        .status(400)
        .json({ message: 'User is already a member of this group' });
      return;
    }

    // Add member to group
    group.members.push(user._id);
    await group.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove member from group
// @route   DELETE /api/groups/:id/members/:userId
// @access  Private
export const removeMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Check if user is admin of the group
    if (
      !group.admins.some(admin => admin.toString() === req.user?._id.toString())
    ) {
      res
        .status(401)
        .json({ message: 'Not authorized to remove members from this group' });
      return;
    }

    // Check if trying to remove themselves (admins can't remove themselves unless they're the only admin)
    if (
      req.params.userId === req.user?._id.toString() &&
      group.admins.length === 1
    ) {
      res
        .status(400)
        .json({ message: 'Cannot remove the only admin from the group' });
      return;
    }

    // Remove member from group
    group.members = group.members.filter(
      member => member.toString() !== req.params.userId
    );

    // Also remove from admins if they were an admin
    group.admins = group.admins.filter(
      admin => admin.toString() !== req.params.userId
    );

    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Promote member to admin
// @route   POST /api/groups/:id/admins
// @access  Private
export const promoteToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const group = await Group.findById(req.params.id);
    const user = await User.findById(req.body.userId);

    if (!group || !user) {
      res.status(404).json({ message: 'Group or user not found' });
      return;
    }

    // Check if user is admin of the group
    if (
      !group.admins.some(admin => admin.toString() === req.user?._id.toString())
    ) {
      res
        .status(401)
        .json({ message: 'Not authorized to promote members to admin' });
      return;
    }

    // Check if user is already an admin
    if (group.admins.some(admin => admin.toString() === user._id.toString())) {
      res
        .status(400)
        .json({ message: 'User is already an admin of this group' });
      return;
    }

    // Check if user is a member
    if (
      !group.members.some(member => member.toString() === user._id.toString())
    ) {
      res
        .status(400)
        .json({ message: 'User must be a member to be promoted to admin' });
      return;
    }

    // Promote member to admin
    group.admins.push(user._id);
    await group.save();

    // Return the updated group with populated members and admins
    const updatedGroup = await Group.findById(group._id)
      .populate('members', 'name phoneNumber')
      .populate('admins', 'name phoneNumber');

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove admin privileges
// @route   DELETE /api/groups/:id/admins/:userId
// @access  Private
export const removeAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Check if user is admin of the group
    if (
      !group.admins.some(admin => admin.toString() === req.user?._id.toString())
    ) {
      res
        .status(401)
        .json({ message: 'Not authorized to remove admin privileges' });
      return;
    }

    // Check if trying to remove themselves (admins can't remove themselves unless they're not the only admin)
    if (
      req.params.userId === req.user?._id.toString() &&
      group.admins.length === 1
    ) {
      res
        .status(400)
        .json({ message: 'Cannot remove the only admin from the group' });
      return;
    }

    // Check if user is actually an admin
    if (!group.admins.some(admin => admin.toString() === req.params.userId)) {
      res.status(400).json({ message: 'User is not an admin of this group' });
      return;
    }

    // Remove admin privileges
    group.admins = group.admins.filter(
      admin => admin.toString() !== req.params.userId
    );

    await group.save();

    // Return the updated group with populated members and admins
    const updatedGroup = await Group.findById(group._id)
      .populate('members', 'name phoneNumber')
      .populate('admins', 'name phoneNumber');

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
