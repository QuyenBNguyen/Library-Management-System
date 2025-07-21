const jwt = require('jsonwebtoken');
const User = require('../models/user');


module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });

  try {
    console.log('\n=== AUTH MIDDLEWARE START ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('❌ No Authorization header');
      return res.status(401).json({ error: 'No token provided' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('❌ Invalid token format - missing Bearer prefix');
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('❌ No token after Bearer prefix');
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log('✅ Token found:', token.substring(0, 20) + '...');
    console.log('Token length:', token.length);
    
    // Kiểm tra JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not configured!');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    console.log('✅ JWT_SECRET is configured, length:', process.env.JWT_SECRET.length);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    // Fetch user from DB to get latest role
    const user = await User.findById(decoded._id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = { _id: user._id, role: user.role };

    next();
  } catch (error) {
    console.error('\n❌ Token verification failed:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token signature' });
    }
    res.status(403).json({ error: 'Token verification failed' });
  }
};
