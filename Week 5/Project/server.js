require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const { execSync } = require('child_process');

// Regenerate Swagger documentation on startup to ensure correct host
console.log('🔄 Regenerating Swagger documentation with current environment...');
try {
  execSync('node swagger.js', { stdio: 'inherit' });
  console.log('✅ Swagger documentation regenerated successfully!');
} catch (error) {
  console.error('❌ Failed to regenerate Swagger documentation:', error.message);
}

const app = express();

// Define PORT early so it can be used throughout the file
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
// Dynamic CORS origin based on environment
const isRender = process.env.RENDER_URL || 
                 process.env.RENDER_SERVICE_ID || 
                 process.env.RENDER || 
                 process.env.NODE_ENV === 'production' ||
                 (process.env.PORT && process.env.PORT !== '3000');

const corsOrigin = isRender 
  ? 'https://recipe-project-f7mh.onrender.com'
  : (process.env.CLIENT_URL || 'http://localhost:3000');

console.log(`🌐 CORS Origin: ${corsOrigin}`);

app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use('/public', express.static('public'));

// Session configuration with improved settings for production
const isProduction = process.env.NODE_ENV === 'production' || 
                     process.env.RENDER_URL || 
                     process.env.RENDER_SERVICE_ID;

console.log(`🍪 Session Configuration - Production: ${isProduction}`);
console.log(`🔑 Session Secret: ${process.env.SESSION_SECRET ? 'SET' : 'USING DEFAULT'}`);

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'recipe-session', // Custom session name
  cookie: {
    secure: isProduction, // Use HTTPS in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Use 'lax' for better compatibility in production
  },
  // Force session store configuration
  rolling: true, // Reset expiration on activity
  proxy: isProduction // Trust proxy headers in production
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware for session tracking
app.use((req, res, next) => {
  if (req.url.includes('/api/auth') || req.url.includes('/auth-test')) {
    console.log(`🔍 Session Debug [${req.method} ${req.url}]:`, {
      sessionID: req.sessionID,
      hasSession: !!req.session,
      hasUser: !!req.user,
      userEmail: req.user?.email || 'None'
    });
  }
  next();
});

// Routes
app.use('/api', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));

// Swagger Documentation with OAuth2 configuration
try {
  console.log('🔍 Attempting to load swagger.json...');
  const swaggerDocument = require('./swagger.json');
  console.log('✅ swagger.json loaded successfully');
  
  // Swagger UI options with OAuth2 configuration
  const swaggerOptions = {
    swaggerOptions: {
      oauth2RedirectUrl: isRender 
        ? 'https://recipe-project-f7mh.onrender.com/api-docs/oauth2-redirect.html'
        : `http://localhost:${PORT}/api-docs/oauth2-redirect.html`,
      initOAuth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: '', // Don't expose client secret in frontend
        realm: 'Recipe API',
        appName: 'Recipe Management API',
        scopeSeparator: ' ',
        scopes: 'openid profile email',
        additionalQueryStringParams: {},
        useBasicAuthenticationWithAccessCodeGrant: false,
        usePkceWithAuthorizationCodeGrant: false
      }
    }
  };
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
  console.log(`📝 Swagger OAuth2 Configuration: ${isRender ? 'Production' : 'Development'} mode`);
} catch (error) {
  console.log('❌ Swagger documentation error:', error.message);
  console.log('⚠️  Swagger documentation not found. Run "npm run swagger" to generate it.');
}

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🍳 Recipe Management API',
    status: 'Server is running',
    documentation: '/api-docs',
    api: '/api'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({
    success: false,
    error: 'Something went wrong on the server'
  });
});

app.listen(PORT, () => {
  // Determine the correct base URL based on environment
  const isRender = process.env.RENDER_URL || 
                   process.env.RENDER_SERVICE_ID || 
                   process.env.RENDER || 
                   process.env.NODE_ENV === 'production' ||
                   (process.env.PORT && process.env.PORT !== '3000');
  
  const baseURL = isRender 
    ? (process.env.RENDER_URL || 'https://recipe-project-f7mh.onrender.com')
    : `http://localhost:${PORT}`;
  
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 API Documentation: ${baseURL}/api-docs`);
  console.log(`🔗 API Base URL: ${baseURL}/api`);
  console.log(`🌍 Environment: ${isRender ? 'Production (Render)' : 'Development'}`);
});