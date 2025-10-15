import User from '../models/User.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const userId = req.params.id;

    // Check if user is updating their own profile
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, bio, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user is deleting their own account
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};
