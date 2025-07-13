// roleMiddleware.js
module.exports = function (roles = []) {
  return (req, res, next) => {
    // Ensure roles is always an array
    if (!Array.isArray(roles)) roles = [roles];

    // Check if user is authenticated AND their role is in the allowed list
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Access denied.' });
    }

    next(); // ✅ User role is valid, go to next middleware or controller
  };
};
