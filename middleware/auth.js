const User = require('../models/user');

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid token.'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Find user by ID (token)
    const user = await User.findById(token).populate('role');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. Please log in again.'
      });
    }
    
    // Add user to request
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during authentication'
    });
  }
};

// Role authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access'
      });
    }

    const roleNames = roles.map(r => r.toLowerCase());
    const userRole = req.user.role.name.toLowerCase();
    
    if (!roleNames.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Role ${userRole} is not authorized to access this resource`
      });
    }
    
    next();
  };
};

module.exports = {
  authMiddleware,
  authorize
};
