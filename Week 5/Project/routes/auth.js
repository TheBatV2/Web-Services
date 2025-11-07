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
    #swagger.description = 'Returns the currently authenticated user\'s information. Use this to test if authentication is working.'
    #swagger.responses[200] = {
      description: 'Current user retrieved successfully',
      schema: {
        success: true,
        data: { $ref: '#/definitions/User' }
      }
    }
    #swagger.responses[401] = {
      description: 'User not authenticated - try GET /api/auth/google first',
      schema: {
        success: false,
        message: 'Not authenticated'
      }
    }
  */
  console.log('🔍 Current User Check:');
  console.log('   - Session ID:', req.sessionID);
  console.log('   - Session:', req.session ? 'EXISTS' : 'MISSING');
  console.log('   - User:', req.user ? 'AUTHENTICATED' : 'NOT AUTHENTICATED');
  console.log('   - Passport Session:', req.session?.passport);
  
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'Authentication successful! You can now use protected endpoints.',
      data: req.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated. Please login via GET /api/auth/google first.'
    });
  }
});

// @desc    Start Google OAuth flow
// @route   GET /api/auth/google
// @access  Public
router.get('/google', 
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = '🚨 IMPORTANT: Do NOT use Execute button!'
    #swagger.description = 'OAuth requires browser redirect. COPY this URL and paste in new browser tab: http://localhost:3000/api/auth/google. OR This if Online: https://recipe-project-f7mh.onrender.com/api/auth/google. After login, return here and test protected endpoints.'
    #swagger.responses[302] = {
      description: 'Redirect to Google OAuth (only works in browser, not AJAX)',
      headers: {
        Location: {
          description: 'Google OAuth URL',
          type: 'string'
        }
      }
    }
  */
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

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
    console.log('🎯 OAuth Callback Success:');
    console.log('   - Session ID:', req.sessionID);
    console.log('   - User:', req.user ? 'AUTHENTICATED' : 'NOT AUTHENTICATED');
    console.log('   - User Data:', req.user ? req.user.email : 'None');
    
    // Force session save before redirect
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
      } else {
        console.log('✅ Session saved successfully');
      }
      
      // Use relative redirect to preserve session
      res.redirect('/public/auth-test.html');
    });
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