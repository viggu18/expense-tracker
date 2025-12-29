import { Request, Response } from 'express';
import Expense, { IExpense } from '../models/Expense';
import Group from '../models/Group';
import User from '../models/User';
import { validationResult } from 'express-validator';

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { description, amount, paidBy, group, splits, category, date } =
      req.body;

    // Log the received data for debugging
    console.log('Received expense data:', {
      description,
      amount,
      paidBy,
      group,
      splits,
      category,
      date,
    });

    // Process splits - if some splits have custom amounts and others are 0 or empty,
    // distribute the remaining amount equally among the 0/empty amount splits
    let processedSplits = [...splits];
    let customAmountTotal = 0;
    let zeroAmountSplits = 0;

    // Calculate total of custom amounts and count zero/empty amount splits
    splits.forEach((split: any) => {
      const splitAmount = parseFloat(split.amount) || 0;
      if (splitAmount > 0) {
        customAmountTotal += splitAmount;
      } else {
        zeroAmountSplits++;
      }
    });

    // If there are splits with zero/empty amounts, distribute the remaining amount equally
    if (zeroAmountSplits > 0) {
      const remainingAmount = amount - customAmountTotal;
      const equalShare = remainingAmount / zeroAmountSplits;

      processedSplits = splits.map((split: any) => {
        const splitAmount = parseFloat(split.amount) || 0;
        if (splitAmount <= 0) {
          return { ...split, amount: parseFloat(equalShare.toFixed(2)) };
        }
        return { ...split, amount: parseFloat(splitAmount.toFixed(2)) };
      });
    } else {
      // If all splits have amounts, ensure they're properly formatted
      processedSplits = splits.map((split: any) => {
        return {
          ...split,
          amount: parseFloat(parseFloat(split.amount).toFixed(2)),
        };
      });
    }

    // Validate that splits sum to total amount
    const totalSplitAmount = processedSplits.reduce(
      (sum: number, split: any) => sum + split.amount,
      0
    );

    // Allow for small floating point differences
    if (Math.abs(totalSplitAmount - amount) > 0.01) {
      res.status(400).json({
        message: 'Split amounts must sum to total amount',
        totalSplitAmount: parseFloat(totalSplitAmount.toFixed(2)),
        amount: parseFloat(amount.toFixed(2)),
        difference: parseFloat(Math.abs(totalSplitAmount - amount).toFixed(2)),
        splits: processedSplits,
      });
      return;
    }

    // If group is provided, verify that all users in splits are members of the group
    if (group) {
      const groupDoc = await Group.findById(group);
      if (!groupDoc) {
        res.status(404).json({ message: 'Group not found' });
        return;
      }

      const groupMemberIds = groupDoc.members.map(member => member.toString());
      const splitUserIds = processedSplits.map((split: any) => split.user);

      const invalidUsers = splitUserIds.filter(
        (userId: string) => !groupMemberIds.includes(userId)
      );
      if (invalidUsers.length > 0) {
        res
          .status(400)
          .json({
            message: 'All users in splits must be members of the group',
          });
        return;
      }
    } else {
      // For non-group expenses, verify that all users exist in the system
      // and that the current user is either the payer or one of the participants
      const splitUserIds = processedSplits.map((split: any) => split.user);

      // Add the payer to the list of users to verify if not already there
      const allUserIds = [...new Set([...splitUserIds, paidBy])];

      // Verify all users exist
      const users = await User.find({
        _id: { $in: allUserIds },
      });

      const existingUserIds = users.map(user => user._id.toString());
      const missingUsers = allUserIds.filter(
        (userId: string) => !existingUserIds.includes(userId)
      );

      if (missingUsers.length > 0) {
        res.status(400).json({
          message: 'Some users in the expense do not exist',
          missingUsers,
        });
        return;
      }

      // Check if current user is involved in the expense
      const currentUserInvolved = allUserIds.includes(req.user?._id.toString());
      if (!currentUserInvolved) {
        res.status(400).json({
          message:
            'You must be either the payer or a participant in the expense',
        });
        return;
      }
    }

    // Create expense
    const expense = new Expense({
      description,
      amount,
      paidBy,
      group: group || null, // Allow null for non-group expenses
      splits: processedSplits,
      category,
      date,
    });

    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all expenses for a user (global view)
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const expenses = await Expense.find({
      $or: [{ paidBy: req.user?._id }, { 'splits.user': req.user?._id }],
    })
      .populate('paidBy', 'name phoneNumber')
      .populate('group', 'name')
      .populate('splits.user', 'name phoneNumber')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get expenses by group
// @route   GET /api/expenses/group/:groupId
// @access  Private
export const getExpensesByGroup = async (
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

    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name phoneNumber')
      .populate('splits.user', 'name phoneNumber')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private
export const getExpenseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('paidBy', 'name phoneNumber')
      .populate('group', 'name')
      .populate('splits.user', 'name phoneNumber');

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    // Check if user is involved in the expense
    const isInvolved =
      expense.paidBy.toString() === req.user?._id.toString() ||
      expense.splits.some(
        split => split.user.toString() === req.user?._id.toString()
      );

    if (!isInvolved) {
      res
        .status(401)
        .json({ message: 'Not authorized to access this expense' });
      return;
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { description, amount, paidBy, group, splits, category, date } =
      req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    // Check if user is the one who paid for the expense
    if (expense.paidBy.toString() !== req.user?._id.toString()) {
      res
        .status(401)
        .json({ message: 'Not authorized to update this expense' });
      return;
    }

    // Process splits - if some splits have custom amounts and others are 0 or empty,
    // distribute the remaining amount equally among the 0/empty amount splits
    let processedSplits = [...splits];
    let customAmountTotal = 0;
    let zeroAmountSplits = 0;

    // Calculate total of custom amounts and count zero/empty amount splits
    splits.forEach((split: any) => {
      const splitAmount = parseFloat(split.amount) || 0;
      if (splitAmount > 0) {
        customAmountTotal += splitAmount;
      } else {
        zeroAmountSplits++;
      }
    });

    // If there are splits with zero/empty amounts, distribute the remaining amount equally
    if (zeroAmountSplits > 0) {
      const remainingAmount = amount - customAmountTotal;
      const equalShare = remainingAmount / zeroAmountSplits;

      processedSplits = splits.map((split: any) => {
        const splitAmount = parseFloat(split.amount) || 0;
        if (splitAmount <= 0) {
          return { ...split, amount: parseFloat(equalShare.toFixed(2)) };
        }
        return { ...split, amount: parseFloat(splitAmount.toFixed(2)) };
      });
    } else {
      // If all splits have amounts, ensure they're properly formatted
      processedSplits = splits.map((split: any) => {
        return {
          ...split,
          amount: parseFloat(parseFloat(split.amount).toFixed(2)),
        };
      });
    }

    // Validate that splits sum to total amount
    const totalSplitAmount = processedSplits.reduce(
      (sum: number, split: any) => sum + split.amount,
      0
    );

    // Allow for small floating point differences
    if (Math.abs(totalSplitAmount - amount) > 0.01) {
      res.status(400).json({
        message: 'Split amounts must sum to total amount',
        totalSplitAmount: parseFloat(totalSplitAmount.toFixed(2)),
        amount: parseFloat(amount.toFixed(2)),
        difference: parseFloat(Math.abs(totalSplitAmount - amount).toFixed(2)),
        splits: processedSplits,
      });
      return;
    }

    // If group is provided, verify that all users in splits are members of the group
    if (group) {
      const groupDoc = await Group.findById(group);
      if (!groupDoc) {
        res.status(404).json({ message: 'Group not found' });
        return;
      }

      const groupMemberIds = groupDoc.members.map(member => member.toString());
      const splitUserIds = processedSplits.map((split: any) => split.user);

      const invalidUsers = splitUserIds.filter(
        (userId: string) => !groupMemberIds.includes(userId)
      );
      if (invalidUsers.length > 0) {
        res
          .status(400)
          .json({
            message: 'All users in splits must be members of the group',
          });
        return;
      }
    } else {
      // For non-group expenses, verify that all users exist in the system
      const splitUserIds = processedSplits.map((split: any) => split.user);

      // Add the payer to the list of users to verify if not already there
      const allUserIds = [...new Set([...splitUserIds, paidBy])];

      // Verify all users exist
      const users = await User.find({
        _id: { $in: allUserIds },
      });

      const existingUserIds = users.map(user => user._id.toString());
      const missingUsers = allUserIds.filter(
        userId => !existingUserIds.includes(userId)
      );

      if (missingUsers.length > 0) {
        res.status(400).json({
          message: 'Some users in the expense do not exist',
          missingUsers,
        });
        return;
      }
    }

    // Update expense
    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;
    expense.paidBy = paidBy || expense.paidBy;
    expense.group = group || expense.group;
    expense.splits = processedSplits || expense.splits;
    expense.category = category || expense.category;
    expense.date = date || expense.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    // Check if user is the one who paid for the expense
    if (expense.paidBy.toString() !== req.user?._id.toString()) {
      res
        .status(401)
        .json({ message: 'Not authorized to delete this expense' });
      return;
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
