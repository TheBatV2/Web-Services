const express = require('express');
const router = express.Router();

// @route   GET /api
// @desc    API welcome message
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Recipe Management API',
    version: '1.0.0',
    endpoints: {
      recipes: '/api/recipes',
      documentation: '/api-docs'
    }
  });
});

module.exports = router;