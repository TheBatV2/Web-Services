const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Load environment variables from the correct path
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import middleware
const { globalErrorHandler, handleNotFound } = require('./middleware/errorHandler');
const { createRateLimit, securityHeaders, sanitizeInput, logRequests } = require('./middleware/security');

const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(createRateLimit(15 * 60 * 1000, 100)); // 100 requests per 15 minutes
app.use(logRequests);

// CORS and parsing middleware
app
  .use(cors())
  .use(express.json({ limit: '10mb' }))
  .use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Swagger setup - MUST be before other routes
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Main routes - MUST be after Swagger
app.use('/', require('./routes'));

// Handle undefined routes
app.all('*', handleNotFound);

// Global error handler - MUST be last
app.use(globalErrorHandler);

const db = require('./models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit(1);
  });

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  db.mongoose.connection.close(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  db.mongoose.connection.close(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
