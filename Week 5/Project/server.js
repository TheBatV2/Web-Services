const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const { execSync } = require('child_process');
require('dotenv').config();

// Regenerate Swagger documentation on startup to ensure correct host
console.log('🔄 Regenerating Swagger documentation with current environment...');
try {
  execSync('node swagger.js', { stdio: 'inherit' });
  console.log('✅ Swagger documentation regenerated successfully!');
} catch (error) {
  console.error('❌ Failed to regenerate Swagger documentation:', error.message);
}

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));

// Swagger Documentation
try {
  const swaggerDocument = require('./swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
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

const PORT = process.env.PORT || 3000;

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