const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configure Google OAuth strategy only if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Dynamic callback URL based on environment
  // First check if we explicitly set RENDER_URL
  let baseURL;
  let isRender = false;
  
  if (process.env.RENDER_URL) {
    // Explicit Render URL set
    baseURL = process.env.RENDER_URL;
    isRender = true;
  } else if (process.env.RENDER_SERVICE_ID || 
             process.env.RENDER || 
             process.env.NODE_ENV === 'production' ||
             (process.env.PORT && process.env.PORT !== '3000')) {
    // Auto-detect Render environment
    baseURL = 'https://recipe-project-f7mh.onrender.com';
    isRender = true;
  } else {
    // Local development
    baseURL = process.env.CLIENT_URL || 'http://localhost:3000';
  }
  
  const callbackURL = `${baseURL}/api/auth/google/callback`;
  
  console.log(`🌍 Environment Variables Check:`);
  console.log(`   - RENDER_URL: ${process.env.RENDER_URL || 'NOT SET'}`);
  console.log(`   - RENDER_SERVICE_ID: ${process.env.RENDER_SERVICE_ID || 'NOT SET'}`);
  console.log(`   - RENDER: ${process.env.RENDER || 'NOT SET'}`);
  console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);
  console.log(`   - PORT: ${process.env.PORT || 'NOT SET'}`);
  console.log(`   - CLIENT_URL: ${process.env.CLIENT_URL || 'NOT SET'}`);
  console.log(`🌍 Detected Environment: ${isRender ? 'Production (Render)' : 'Development'}`);
  console.log(`🔗 Base URL: ${baseURL}`);
  console.log(`🔗 OAuth Callback URL: ${callbackURL}`);
  console.log(`🔑 Client ID: ${process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET'}`);
  console.log(`🔐 Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET'}`);
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let existingUser = await User.findOne({ googleId: profile.id });
      
      if (existingUser) {
        // Update last login time
        existingUser.lastLoginAt = new Date();
        await existingUser.save();
        return done(null, existingUser);
      }

      // Check if user exists with same email
      let existingEmailUser = await User.findOne({ email: profile.emails[0].value });
      
      if (existingEmailUser) {
        // Link Google account to existing user
        existingEmailUser.googleId = profile.id;
        existingEmailUser.lastLoginAt = new Date();
        if (!existingEmailUser.profilePicture && profile.photos[0]) {
          existingEmailUser.profilePicture = profile.photos[0].value;
        }
        await existingEmailUser.save();
        return done(null, existingEmailUser);
      }

      // Create new user
      const newUser = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0] ? profile.photos[0].value : null,
        lastLoginAt: new Date()
      });

      return done(null, newUser);
    } catch (error) {
      console.error('Error in Google OAuth strategy:', error);
      return done(error, null);
    }
  }));
} else {
  console.log('⚠️  Google OAuth credentials not found. OAuth authentication will not be available.');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-__v');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;