require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const database = require('./database/database');
const swaggerSpec = require('./config/swagger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CSE 341 API Documentation'
}));

// Import and use routes
const routes = require('./routes');
app.use('/', routes);

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

// Initialize database and start server
database.initDb((err, db) => {
  if (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Professional data available at http://localhost:${PORT}/professional`);
    console.log(`Contacts API available at http://localhost:${PORT}/contacts`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
});

module.exports = app;