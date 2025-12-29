import mongoose, { Document, Schema } from 'mongoose';

export interface ICurrency extends Document {
  code: string;
  name: string;
  symbol: string;
  createdAt: Date;
  updatedAt: Date;
}

const CurrencySchema: Schema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
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
CurrencySchema.pre<ICurrency>('save', function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.model<ICurrency>('Currency', CurrencySchema);
