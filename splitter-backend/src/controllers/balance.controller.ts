import { Request, Response } from 'express';
import Expense, { IExpense } from '../models/Expense';
import Settlement, { ISettlement } from '../models/Settlement';
import mongoose from 'mongoose';
import { IUser } from '../models/User';

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Define populated types
interface PopulatedGroup {
  _id: mongoose.Types.ObjectId;
  name: string;
}

interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  name: string;
}

interface PopulatedExpense
  extends Omit<IExpense, 'group' | 'paidBy' | 'splits'> {
  group: PopulatedGroup;
  paidBy: mongoose.Types.ObjectId | PopulatedUser;
  splits: {
    user: mongoose.Types.ObjectId | PopulatedUser;
    amount: number;
  }[];
}

interface PopulatedSettlement extends Omit<ISettlement, 'group'> {
  group: PopulatedGroup;
}

// @desc    Get user's balances across all groups
// @route   GET /api/balances
// @access  Private
export const getBalances = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!req.user._id) {
      res.status(401).json({ message: 'User ID not found' });
      return;
    }

    // Get all expenses where user is involved
    let expenses: PopulatedExpense[] = [];
    try {
      expenses = (await Expense.find({
        $or: [{ paidBy: req.user._id }, { 'splits.user': req.user._id }],
      }).populate('group', 'name')) as unknown as PopulatedExpense[];
    } catch (error) {
      console.error('Error fetching expenses:', error);
      expenses = [];
    }

    // Get all settlements where user is involved
    let settlements: PopulatedSettlement[] = [];
    try {
      settlements = (await Settlement.find({
        $or: [{ from: req.user._id }, { to: req.user._id }],
      }).populate('group', 'name')) as unknown as PopulatedSettlement[];
    } catch (error) {
      console.error('Error fetching settlements:', error);
      settlements = [];
    }

    // Calculate balances
    const balances: any = {};

    // Process expenses
    expenses.forEach((expense: PopulatedExpense) => {
      try {
        // Skip expenses without a group
        if (!expense.group) return;

        const groupId = (expense.group as PopulatedGroup)._id.toString();
        const groupName = (expense.group as PopulatedGroup).name;

        if (!balances[groupId]) {
          balances[groupId] = {
            groupId,
            groupName,
            totalOwed: 0,
            totalDue: 0,
            netBalance: 0,
          };
        }

        // If user paid for the expense
        if (
          (expense.paidBy as mongoose.Types.ObjectId).toString() ===
          req.user!._id.toString()
        ) {
          // Add amounts owed by others
          expense.splits.forEach(
            (split: {
              user: mongoose.Types.ObjectId | PopulatedUser;
              amount: number;
            }) => {
              if (
                (split.user as mongoose.Types.ObjectId).toString() !==
                req.user!._id.toString()
              ) {
                balances[groupId].totalOwed += split.amount;
                balances[groupId].netBalance += split.amount;
              }
            }
          );
        } else {
          // If user is owed money
          const userSplit = expense.splits.find(
            (split: {
              user: mongoose.Types.ObjectId | PopulatedUser;
              amount: number;
            }) =>
              (split.user as mongoose.Types.ObjectId).toString() ===
              req.user!._id.toString()
          );

          if (userSplit) {
            balances[groupId].totalDue += userSplit.amount;
            balances[groupId].netBalance -= userSplit.amount;
          }
        }
      } catch (error) {
        console.error('Error processing expense:', error);
      }
    });

    // Process settlements
    settlements.forEach((settlement: PopulatedSettlement) => {
      try {
        // Skip settlements without a group
        if (!settlement.group) return;

        const groupId = (settlement.group as PopulatedGroup)._id.toString();
        const groupName = (settlement.group as PopulatedGroup).name;

        if (!balances[groupId]) {
          balances[groupId] = {
            groupId,
            groupName,
            totalOwed: 0,
            totalDue: 0,
            netBalance: 0,
          };
        }

        // If user is the one who paid (from)
        if (settlement.from.toString() === req.user!._id.toString()) {
          balances[groupId].totalOwed += settlement.amount;
          balances[groupId].netBalance += settlement.amount;
        }
        // If user is the one who received (to)
        else if (settlement.to.toString() === req.user!._id.toString()) {
          balances[groupId].totalDue += settlement.amount;
          balances[groupId].netBalance -= settlement.amount;
        }
      } catch (error) {
        console.error('Error processing settlement:', error);
      }
    });

    // Convert to array and calculate overall balance
    const balancesArray = Object.values(balances);
    const overallBalance = balancesArray.reduce(
      (sum, balance: any) => sum + balance.netBalance,
      0
    );

    res.json({
      overallBalance,
      balances: balancesArray,
    });
  } catch (error) {
    console.error('Error in getBalances:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's balances for a specific group
// @route   GET /api/balances/group/:groupId
// @access  Private
export const getGroupBalances = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groupId = req.params.groupId;

    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!req.user._id) {
      res.status(401).json({ message: 'User ID not found' });
      return;
    }

    // Get all expenses for the group where user is involved
    let expenses: IExpense[] = [];
    try {
      expenses = await Expense.find({
        group: groupId,
        $or: [{ paidBy: req.user._id }, { 'splits.user': req.user._id }],
      });
    } catch (error) {
      console.error('Error fetching group expenses:', error);
      expenses = [];
    }

    // Get all settlements for the group where user is involved
    let settlements: ISettlement[] = [];
    try {
      settlements = await Settlement.find({
        group: groupId,
        $or: [{ from: req.user._id }, { to: req.user._id }],
      });
    } catch (error) {
      console.error('Error fetching group settlements:', error);
      settlements = [];
    }

    // Calculate balances for each user in the group
    const userBalances: any = {};

    // Process expenses
    expenses.forEach((expense: IExpense) => {
      try {
        const paidById = expense.paidBy.toString();

        // Initialize user balance if not exists
        if (!userBalances[paidById]) {
          userBalances[paidById] = 0;
        }

        // Add amounts for users who owe money to the payer
        expense.splits.forEach(
          (split: { user: mongoose.Types.ObjectId; amount: number }) => {
            const userId = split.user.toString();

            // Skip the person who paid
            if (userId === paidById) return;

            // Initialize user balance if not exists
            if (!userBalances[userId]) {
              userBalances[userId] = 0;
            }

            // Subtract what they owe
            userBalances[userId] -= split.amount;
            // Add what the payer is owed
            userBalances[paidById] += split.amount;
          }
        );
      } catch (error) {
        console.error('Error processing group expense:', error);
      }
    });

    // Process settlements
    settlements.forEach((settlement: ISettlement) => {
      try {
        const fromId = settlement.from.toString();
        const toId = settlement.to.toString();

        // Initialize user balances if not exists
        if (!userBalances[fromId]) {
          userBalances[fromId] = 0;
        }
        if (!userBalances[toId]) {
          userBalances[toId] = 0;
        }

        // Subtract amount from sender
        userBalances[fromId] -= settlement.amount;
        // Add amount to receiver
        userBalances[toId] += settlement.amount;
      } catch (error) {
        console.error('Error processing group settlement:', error);
      }
    });

    res.json(userBalances);
  } catch (error) {
    console.error('Error in getGroupBalances:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
