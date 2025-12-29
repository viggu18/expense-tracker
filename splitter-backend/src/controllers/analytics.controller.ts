import { Request, Response } from 'express';
import Expense, { IExpense } from '../models/Expense';
import Group from '../models/Group';
import mongoose from 'mongoose';

// Define populated types
interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  name: string;
}

interface PopulatedGroup {
  _id: mongoose.Types.ObjectId;
  name: string;
}

interface IExpenseSplit {
  user: mongoose.Types.ObjectId | PopulatedUser;
  amount: number;
}

interface PopulatedExpense
  extends Omit<IExpense, 'paidBy' | 'splits' | 'group'> {
  paidBy: mongoose.Types.ObjectId | PopulatedUser;
  splits: IExpenseSplit[];
  group: mongoose.Types.ObjectId | PopulatedGroup;
}

// @desc    Get analytics for a specific group
// @route   GET /api/analytics/group/:groupId
// @access  Private
export const getGroupAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groupId = req.params.groupId;

    // Verify group exists and user is member
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    if (
      !group.members.some(
        member => member.toString() === req.user?._id.toString()
      )
    ) {
      res.status(401).json({ message: 'Not authorized to access this group' });
      return;
    }

    // Get all expenses for the group
    const expenses = (await Expense.find({ group: groupId })
      .populate('paidBy', 'name')
      .populate('splits.user', 'name')) as unknown as PopulatedExpense[];

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Calculate per-person spending
    const personSpending: any = {};
    expenses.forEach((expense: PopulatedExpense) => {
      const paidById = (expense.paidBy as PopulatedUser)._id.toString();
      const paidByName = (expense.paidBy as PopulatedUser).name;

      if (!personSpending[paidById]) {
        personSpending[paidById] = {
          name: paidByName,
          totalPaid: 0,
          totalOwed: 0,
          netBalance: 0,
        };
      }

      personSpending[paidById].totalPaid += expense.amount;
    });

    // Calculate amounts owed to each person
    expenses.forEach((expense: PopulatedExpense) => {
      expense.splits.forEach((split: IExpenseSplit) => {
        const userId = (split.user as PopulatedUser)._id.toString();
        const userName = (split.user as PopulatedUser).name;

        if (!personSpending[userId]) {
          personSpending[userId] = {
            name: userName,
            totalPaid: 0,
            totalOwed: 0,
            netBalance: 0,
          };
        }

        personSpending[userId].totalOwed += split.amount;
      });
    });

    // Calculate net balances
    Object.keys(personSpending).forEach(userId => {
      const person = personSpending[userId];
      person.netBalance = person.totalPaid - person.totalOwed;
    });

    // Find top spender
    let topSpender = null;
    let maxSpent = 0;
    Object.keys(personSpending).forEach(userId => {
      if (personSpending[userId].totalPaid > maxSpent) {
        maxSpent = personSpending[userId].totalPaid;
        topSpender = personSpending[userId];
      }
    });

    // Calculate spending by category
    const categorySpending: any = {};
    expenses.forEach((expense: PopulatedExpense) => {
      const category = expense.category || 'Other';
      if (!categorySpending[category]) {
        categorySpending[category] = 0;
      }
      categorySpending[category] += expense.amount;
    });

    // Calculate average spend per person
    const totalPeople = Object.keys(personSpending).length;
    const averageSpend = totalPeople > 0 ? totalExpenses / totalPeople : 0;

    res.json({
      totalExpenses,
      personSpending,
      topSpender,
      categorySpending,
      averageSpend,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get global analytics across all groups
// @route   GET /api/analytics
// @access  Private
export const getGlobalAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get all expenses where user is involved
    const expenses = (await Expense.find({
      $or: [{ paidBy: req.user?._id }, { 'splits.user': req.user?._id }],
    })
      .populate('group', 'name')
      .populate('paidBy', 'name')
      .populate('splits.user', 'name')) as unknown as PopulatedExpense[];

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Group spending by category
    const categorySpending: any = {};
    expenses.forEach((expense: PopulatedExpense) => {
      const category = expense.category || 'Other';
      if (!categorySpending[category]) {
        categorySpending[category] = 0;
      }
      categorySpending[category] += expense.amount;
    });

    // Spending over time (monthly)
    const monthlySpending: any = {};
    expenses.forEach((expense: PopulatedExpense) => {
      const month = new Date(expense.date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlySpending[month]) {
        monthlySpending[month] = 0;
      }
      monthlySpending[month] += expense.amount;
    });

    res.json({
      totalExpenses,
      categorySpending,
      monthlySpending,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
