const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const app = express();

console.log('🔄 Starting test server without database...');

// Simple CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Simple session configuration
app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Test route
app.get('/', (req, res) => {
  res.json({
    message: '🍳 Recipe Management API - Test Server',
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test Swagger route
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'Swagger would be here',
    oauth2: 'OAuth2 configuration test'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📖 Test URL: http://localhost:${PORT}`);
  console.log(`🧪 This is a minimal test server to verify basic functionality`);
});