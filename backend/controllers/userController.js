const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Get all users (manager: librarians+members, librarian: members only)
exports.getAllUsers = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'librarian') {
      filter.role = 'member';
    } else if (req.user.role === 'manager') {
      filter.role = { $in: ['librarian', 'member'] };
    } else {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    // Add search by name, email, or phone
    if (req.query.search) {
      const s = req.query.search;
      filter.$or = [
        { name: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { phone: { $regex: s, $options: 'i' } }
      ];
    }
    const users = await User.find(filter).select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (req.user.role === 'librarian' && user.role !== 'member') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    if (req.user.role === 'manager' && !['librarian', 'member'].includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'member', phone, street, district, city } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }
    if (req.user.role === 'librarian' && role !== 'member') {
      return res.status(403).json({ success: false, error: 'Librarians can only create members.' });
    }
    if (req.user.role === 'manager' && !['librarian', 'member'].includes(role)) {
      return res.status(403).json({ success: false, error: 'Managers can only create librarians or members.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      street,
      district,
      city
    });
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ success: true, data: userObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (req.user.role === 'librarian' && user.role !== 'member') {
      return res.status(403).json({ success: false, error: 'Librarians can only update members.' });
    }
    if (req.user.role === 'manager' && !['librarian', 'member'].includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Managers can only update librarians or members.' });
    }
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }
    Object.assign(user, updates);
    const updated = await user.save();
    const userObj = updated.toObject();
    delete userObj.password;
    res.status(200).json({ success: true, data: userObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (req.user.role === 'librarian' && user.role !== 'member') {
      return res.status(403).json({ success: false, error: 'Librarians can only delete members.' });
    }
    if (req.user.role === 'manager' && !['librarian', 'member'].includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Managers can only delete librarians or members.' });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 