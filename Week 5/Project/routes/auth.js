const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Get current user
// @route   GET /api/auth/current-user
// @access  Private
router.get('/current-user', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Get current authenticated user'
    #swagger.description = 'Returns the currently authenticated user's information'
    #swagger.responses[200] = {
      description: 'Current user retrieved successfully',
      schema: {
        success: true,
        data: { $ref: '#/definitions/User' }
      }
    }
    #swagger.responses[401] = {
      description: 'User not authenticated',
      schema: {
        success: false,
        message: 'Not authenticated'
      }
    }
  */
  if (req.user) {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
});

// @desc    Start Google OAuth flow
// @route   GET /api/auth/google
// @access  Public
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
/*
  #swagger.tags = ['Authentication']
  #swagger.summary = 'Start Google OAuth authentication'
  #swagger.description = 'Redirects user to Google OAuth consent screen'
*/

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    /*
      #swagger.tags = ['Authentication']
      #swagger.summary = 'Google OAuth callback'
      #swagger.description = 'Handles the callback from Google OAuth and redirects user'
    */
    // Successful authentication, redirect to dashboard or home
    res.redirect(process.env.CLIENT_URL || '/');
  }
);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Logout user'
    #swagger.description = 'Logs out the current user and destroys the session'
    #swagger.responses[200] = {
      description: 'User logged out successfully',
      schema: {
        success: true,
        message: 'Logged out successfully'
      }
    }
  */
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error during logout'
      });
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error destroying session'
        });
      }
      
      res.clearCookie('connect.sid');
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Get user profile'
    #swagger.description = 'Get detailed profile information for the authenticated user'
    #swagger.responses[200] = {
      description: 'Profile retrieved successfully',
      schema: {
        success: true,
        data: { $ref: '#/definitions/User' }
      }
    }
    #swagger.responses[401] = {
      description: 'User not authenticated'
    }
  */
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  res.status(200).json({
    success: true,
    data: req.user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', async (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Update user profile'
    #swagger.description = 'Update the authenticated user\'s profile information'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Profile update data',
      required: true,
      schema: {
        bio: 'string',
        dietaryPreferences: ['string'],
        cookingSkillLevel: 'string'
      }
    }
  */
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  try {
    const { bio, dietaryPreferences, cookingSkillLevel } = req.body;
    const User = require('../models/User');
    
    const allowedUpdates = {};
    if (bio !== undefined) allowedUpdates.bio = bio;
    if (dietaryPreferences !== undefined) allowedUpdates.dietaryPreferences = dietaryPreferences;
    if (cookingSkillLevel !== undefined) allowedUpdates.cookingSkillLevel = cookingSkillLevel;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      allowedUpdates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

module.exports = router;