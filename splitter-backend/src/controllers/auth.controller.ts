import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { validationResult } from 'express-validator';

// Function to normalize Indian phone numbers (always remove 91)
const normalizeIndianPhoneNumber = (phoneNumber: string): string => {
  // Remove all spaces and non-digit characters
  let normalized = phoneNumber.replace(/\D/g, '');

  // Always remove 91 prefix if present
  if (normalized.startsWith('91') && normalized.length === 12) {
    return normalized.substring(2);
  }

  // If it's an 11-digit number starting with 0, remove the 0
  if (normalized.startsWith('0') && normalized.length === 11) {
    return normalized.substring(1);
  }

  // If it's already a 10-digit number, return as is
  if (normalized.length === 10) {
    return normalized;
  }

  // Return as is if none of the above patterns match
  return normalized;
};

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, phoneNumber, password } = req.body;

    // Normalize the phone number (always remove 91)
    const normalizedPhoneNumber = normalizeIndianPhoneNumber(phoneNumber);

    // Check if user exists by phone number
    const userExists = await User.findOne({
      phoneNumber: normalizedPhoneNumber,
    });
    if (userExists) {
      res
        .status(400)
        .json({ message: 'User with this phone number already exists' });
      return;
    }

    // Create user with normalized phone number (without 91)
    const user = await User.create({
      name,
      phoneNumber: normalizedPhoneNumber,
      password,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      currency: user.currency, // Include currency in response
      bio: user.bio, // Include bio in response
      email: user.email, // Include email in response
      createdAt: user.createdAt, // Include createdAt in response
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { phoneNumber, password } = req.body;

    // Normalize the phone number (always remove 91)
    const normalizedPhoneNumber = normalizeIndianPhoneNumber(phoneNumber);

    // Find user by phone number
    const user = await User.findOne({
      phoneNumber: normalizedPhoneNumber,
    }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      currency: user.currency, // Include currency in response
      bio: user.bio, // Include bio in response
      email: user.email, // Include email in response
      createdAt: user.createdAt, // Include createdAt in response
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      currency: user.currency, // Include currency in response
      bio: user.bio, // Include bio in response
      email: user.email, // Include email in response
      createdAt: user.createdAt, // Include createdAt in response
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
