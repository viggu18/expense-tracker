import mongoose, { Document, Schema } from 'mongoose';

export interface ISettlement extends Document {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  amount: number;
  group: mongoose.Types.ObjectId | null;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SettlementSchema: Schema = new Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  description: {
    type: String,
    trim: true,
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
SettlementSchema.pre<ISettlement>('save', function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.model<ISettlement>('Settlement', SettlementSchema);
