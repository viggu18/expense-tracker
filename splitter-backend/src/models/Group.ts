import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  admins: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
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
GroupSchema.pre<IGroup>('save', function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.model<IGroup>('Group', GroupSchema);
