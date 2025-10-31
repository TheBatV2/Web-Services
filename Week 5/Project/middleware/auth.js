// Authentication middleware to protect routes

/**
 * Middleware to ensure user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    message: 'Authentication required. Please log in with Google.',
    redirectUrl: '/api/auth/google'
  });
};

/**
 * Middleware to check if user is authenticated (optional)
 * Doesn't block request if not authenticated, just sets user info
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = (req, res, next) => {
  // User info will be available in req.user if authenticated
  // Route can check if (req.user) to see if user is logged in
  next();
};

/**
 * Middleware to ensure user owns the resource or is admin
 * @param {String} resourceUserField - Field name that contains the user ID (default: 'author')
 */
const requireOwnership = (resourceUserField = 'author') => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    try {
      // This middleware should be used after the resource is loaded
      // The resource should be available in req.resource or similar
      const resource = req.recipe || req.resource;
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Check if user owns the resource
      const resourceUserId = resource[resourceUserField];
      if (!resourceUserId || resourceUserId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only modify your own resources.'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking resource ownership',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to attach user info to request for public routes
 * Useful for routes that show different content based on auth status
 */
const attachUser = (req, res, next) => {
  // req.user will be automatically attached by passport if user is authenticated
  // This middleware can be used to add additional user context if needed
  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireOwnership,
  attachUser
};