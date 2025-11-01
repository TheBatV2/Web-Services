const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configure Google OAuth strategy only if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.CLIENT_URL || 'http://localhost:3000'}/api/auth/google/callback`
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