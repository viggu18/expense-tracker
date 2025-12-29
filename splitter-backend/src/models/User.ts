import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  phoneNumber: string;
  password: string;
  friends: mongoose.Types.ObjectId[];
  currency: string; // Add currency preference field
  bio?: string; // Add optional bio field
  email?: string; // Add optional email field
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  currency: {
    type: String,
    default: 'INR', // Changed default currency to INR
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500, // Limit bio to 500 characters
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v: string) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address',
    },
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

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    console.error('Password hashing error:', error);
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  try {
    return bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    throw error;
  }
};

// Update updatedAt before saving
UserSchema.pre<IUser>('save', function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
