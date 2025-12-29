import { Request, Response } from 'express';
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

// Function to check if two Indian phone numbers match (always remove 91)
const phoneNumbersMatch = (phone1: string, phone2: string): boolean => {
  const normalized1 = normalizeIndianPhoneNumber(phone1);
  const normalized2 = normalizeIndianPhoneNumber(phone2);

  // Direct match (both without 91)
  return normalized1 === normalized2;
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search users by phone number
// @route   GET /api/users/search?phoneNumber=:phoneNumber
// @access  Private
export const searchUsersByPhoneNumber = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      res
        .status(400)
        .json({ message: 'Phone number query parameter is required' });
      return;
    }

    // Get all users and filter them using our improved phone number matching
    const allUsers = await User.find().select('-password');

    // Filter users based on phone number match or name match
    const users = allUsers.filter(user => {
      // Match by name (case insensitive)
      if (user.name.toLowerCase().includes(phoneNumber.toLowerCase())) {
        return true;
      }

      // Match by phone number using our improved matching function
      const isMatch = phoneNumbersMatch(user.phoneNumber, phoneNumber);
      return isMatch;
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload contacts and find matching users
// @route   POST /api/users/:id/contacts
// @access  Private
export const uploadContacts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { contacts } = req.body;

    if (!contacts || !Array.isArray(contacts)) {
      res.status(400).json({ message: 'Contacts array is required' });
      return;
    }

    // Get current user
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user is authorized to update this profile
    if (user._id.toString() !== req.user?._id.toString()) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    // Find matching users from contacts
    const phoneNumbers = contacts
      .map((contact: any) => contact.phoneNumber)
      .filter((phone: string) => phone);

    // Search for users with matching phone numbers
    const matchingUsers = await User.find({
      phoneNumber: { $in: phoneNumbers.map(normalizeIndianPhoneNumber) },
      _id: { $ne: user._id }, // Exclude current user
    }).select('name phoneNumber');

    // Get existing friend IDs
    const existingFriendIds = user.friends.map(friend => friend.toString());

    // Filter out matching users that are already friends
    const newFriends = matchingUsers.filter(
      matchingUser => !existingFriendIds.includes(matchingUser._id.toString())
    );

    // Only add new friends if there are any
    if (newFriends.length > 0) {
      const newFriendIds = newFriends.map(u => u._id);
      user.friends = [...user.friends, ...newFriendIds];
      await user.save();
    }

    res.json({
      message: 'Contacts uploaded successfully',
      matchingUsers: newFriends,
      newFriendsCount: newFriends.length,
    });
  } catch (error) {
    console.error('Upload contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get friends of a user
// @route   GET /api/users/:id/friends
// @access  Private
export const getUserFriends = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate the user ID
    if (!req.params.id) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    // First get the user to verify they exist
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Then populate the friends field
    const userWithFriends = await User.findById(req.params.id)
      .populate('friends', 'name phoneNumber')
      .select('friends');

    if (!userWithFriends) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Return the friends array, ensuring it's always an array
    const friendsArray = userWithFriends.friends || [];
    res.json(friendsArray);
  } catch (error) {
    console.error('Error in getUserFriends:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Update user profile (including bio and email)
// @route   PUT /api/users/:id/profile
// @access  Private
export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, bio, email } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user is authorized to update this profile
    if (user._id.toString() !== req.user?._id.toString()) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    // Update user fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio; // Allow empty string to clear bio
    if (email !== undefined) user.email = email; // Allow empty string to clear email

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      currency: user.currency,
      bio: user.bio,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user currency preference
// @route   PUT /api/users/:id/currency
// @access  Private
export const updateUserCurrency = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currency } = req.body;

    // Validate currency
    if (!currency) {
      res.status(400).json({ message: 'Currency is required' });
      return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user is authorized to update this profile
    if (user._id.toString() !== req.user?._id.toString()) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    // Update user currency
    user.currency = currency;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      currency: user.currency,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add friend
// @route   POST /api/users/:id/friends
// @access  Private
export const addFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.body.friendId);

    if (!user || !friend) {
      res.status(404).json({ message: 'User or friend not found' });
      return;
    }

    // Check if user is trying to add themselves
    if (user._id.toString() === friend._id.toString()) {
      res.status(400).json({ message: 'You cannot add yourself as a friend' });
      return;
    }

    // Check if friend already added
    if (user.friends.includes(friend._id)) {
      res.status(400).json({ message: 'Friend already added' });
      return;
    }

    // Add friend to both users
    user.friends.push(friend._id);
    friend.friends.push(user._id);

    await user.save();
    await friend.save();

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove friend
// @route   DELETE /api/users/:id/friends/:friendId
// @access  Private
export const removeFriend = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.params.friendId);

    if (!user || !friend) {
      res.status(404).json({ message: 'User or friend not found' });
      return;
    }

    // Remove friend from both users
    user.friends = user.friends.filter(
      friendId => friendId.toString() !== friend._id.toString()
    );
    friend.friends = friend.friends.filter(
      friendId => friendId.toString() !== user._id.toString()
    );

    await user.save();
    await friend.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
