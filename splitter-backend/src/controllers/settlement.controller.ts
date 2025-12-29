import { Request, Response } from 'express';
import Settlement, { ISettlement } from '../models/Settlement';
import Group from '../models/Group';
import { validationResult } from 'express-validator';

// @desc    Create a new settlement
// @route   POST /api/settlements
// @access  Private
export const createSettlement = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { from, to, amount, group, description, date } = req.body;

    // If group is provided, verify that both users are members of the group
    if (group) {
      const groupDoc = await Group.findById(group);
      if (!groupDoc) {
        res.status(404).json({ message: 'Group not found' });
        return;
      }

      const groupMemberIds = groupDoc.members.map(member => member.toString());

      if (!groupMemberIds.includes(from) || !groupMemberIds.includes(to)) {
        res
          .status(400)
          .json({ message: 'Both users must be members of the group' });
        return;
      }
    }

    // Create settlement
    const settlement = new Settlement({
      from,
      to,
      amount,
      group: group || null,
      description,
      date,
    });

    const createdSettlement = await settlement.save();
    res.status(201).json(createdSettlement);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all settlements for a user
// @route   GET /api/settlements
// @access  Private
export const getSettlements = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settlements = await Settlement.find({
      $or: [{ from: req.user?._id }, { to: req.user?._id }],
    })
      .populate('from', 'name email')
      .populate('to', 'name email')
      .populate('group', 'name')
      .sort({ date: -1 });

    res.json(settlements);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get settlements by group
// @route   GET /api/settlements/group/:groupId
// @access  Private
export const getSettlementsByGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Check if user is member of the group
    if (
      !group.members.some(
        member => member.toString() === req.user?._id.toString()
      )
    ) {
      res.status(401).json({ message: 'Not authorized to access this group' });
      return;
    }

    const settlements = await Settlement.find({ group: req.params.groupId })
      .populate('from', 'name email')
      .populate('to', 'name email')
      .sort({ date: -1 });

    res.json(settlements);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get settlement by ID
// @route   GET /api/settlements/:id
// @access  Private
export const getSettlementById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settlement = await Settlement.findById(req.params.id)
      .populate('from', 'name email')
      .populate('to', 'name email')
      .populate('group', 'name');

    if (!settlement) {
      res.status(404).json({ message: 'Settlement not found' });
      return;
    }

    // Check if user is involved in the settlement
    const isInvolved =
      settlement.from.toString() === req.user?._id.toString() ||
      settlement.to.toString() === req.user?._id.toString();

    if (!isInvolved) {
      res
        .status(401)
        .json({ message: 'Not authorized to access this settlement' });
      return;
    }

    res.json(settlement);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update settlement
// @route   PUT /api/settlements/:id
// @access  Private
export const updateSettlement = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { from, to, amount, group, description, date } = req.body;
    const settlement = await Settlement.findById(req.params.id);

    if (!settlement) {
      res.status(404).json({ message: 'Settlement not found' });
      return;
    }

    // Check if user is the one who made the settlement
    if (settlement.from.toString() !== req.user?._id.toString()) {
      res
        .status(401)
        .json({ message: 'Not authorized to update this settlement' });
      return;
    }

    // If group is provided, verify that both users are members of the group
    if (group) {
      const groupDoc = await Group.findById(group);
      if (!groupDoc) {
        res.status(404).json({ message: 'Group not found' });
        return;
      }

      const groupMemberIds = groupDoc.members.map(member => member.toString());

      if (!groupMemberIds.includes(from) || !groupMemberIds.includes(to)) {
        res
          .status(400)
          .json({ message: 'Both users must be members of the group' });
        return;
      }
    }

    // Update settlement
    settlement.from = from || settlement.from;
    settlement.to = to || settlement.to;
    settlement.amount = amount || settlement.amount;
    settlement.group = group || settlement.group;
    settlement.description = description || settlement.description;
    settlement.date = date || settlement.date;

    const updatedSettlement = await settlement.save();
    res.json(updatedSettlement);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete settlement
// @route   DELETE /api/settlements/:id
// @access  Private
export const deleteSettlement = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settlement = await Settlement.findById(req.params.id);

    if (!settlement) {
      res.status(404).json({ message: 'Settlement not found' });
      return;
    }

    // Check if user is the one who made the settlement
    if (settlement.from.toString() !== req.user?._id.toString()) {
      res
        .status(401)
        .json({ message: 'Not authorized to delete this settlement' });
      return;
    }

    await settlement.deleteOne();
    res.json({ message: 'Settlement removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
