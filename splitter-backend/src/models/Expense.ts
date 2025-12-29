import mongoose, { Document, Schema } from 'mongoose';

export interface IExpenseSplit {
  user: mongoose.Types.ObjectId;
  amount: number;
}

export interface IExpense extends Document {
  description: string;
  amount: number;
  paidBy: mongoose.Types.ObjectId;
  group: mongoose.Types.ObjectId | null;
  splits: IExpenseSplit[];
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  splits: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  category: {
    type: String,
    trim: true,
    default: 'Other',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
ExpenseSchema.pre<IExpense>('save', function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);