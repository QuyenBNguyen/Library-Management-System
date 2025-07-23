const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to get latest role and status
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if user is banned
    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Your account has been banned. Please contact administrator.' });
    }

    req.user = { _id: user._id, role: user.role, status: user.status };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token signature' });
    }
    res.status(403).json({ error: 'Token verification failed' });
  }
};
