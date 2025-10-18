const express = require('express');
const router = express.Router();

// Import route modules
const contactsRoute = require('./contacts');

// Professional data (moved from server.js)
const professionalData = {
  professionalName: "Spencer Barbre",
  baseAssignmentGitHubUrl: "https://github.com/TheBatV2/Web-Services.git",
  currentAssignmentGitHubUrl: "https://github.com/TheBatV2/Web-Services/tree/main/Week%202",
  whatILearnedInThisAssignment: "In this assignment, I learned how to create and structure a Node.js backend application with Express.js. I gained experience in setting up RESTful API endpoints for CRUD operations, implementing proper error handling, and integrating MongoDB for data persistence. I also learned about API documentation using Swagger/OpenAPI, implementing CORS for cross-origin requests, and structuring code with a proper MVC architecture pattern using controllers and routes. Additionally, I learned about environment configuration management and deploying applications to cloud platforms like Render.",
  githubUsername: "TheBatV2",
  deployedLinks: {
    localhost: "http://localhost:8080",
    render: "https://web-services-jua6.onrender.com"
  }
};

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Information
 *     description: Returns general information about the CSE 341 Web Services API including available endpoints and documentation
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CSE 341 Web Services API"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     professional:
 *                       type: string
 *                       example: "/professional"
 *                     contacts:
 *                       type: string
 *                       example: "/contacts"
 *                     health:
 *                       type: string
 *                       example: "/health"
 *                 documentation:
 *                   type: object
 *                   description: "Detailed descriptions of each endpoint"
 */
// Root route - API information
router.get('/', (req, res) => {
  res.json({
    message: 'CSE 341 Web Services API',
    endpoints: {
      professional: '/professional',
      contacts: '/contacts',
      health: '/health',
      swagger: '/api-docs'
    },
    documentation: {
      professional: 'GET /professional - Returns professional information',
      allContacts: 'GET /contacts - Returns all contacts',
      singleContact: 'GET /contacts/:id - Returns a specific contact by ID',
      createContact: 'POST /contacts - Creates a new contact (requires: firstName, lastName, email, favoriteColor, birthday)',
      updateContact: 'PUT /contacts/:id - Updates an existing contact (requires all fields)',
      deleteContact: 'DELETE /contacts/:id - Deletes a contact by ID',
      health: 'GET /health - Server health check',
      swagger: 'GET /api-docs - Interactive Swagger API documentation'
    }
  });
});

/**
 * @swagger
 * /professional:
 *   get:
 *     summary: Get professional information
 *     description: Returns professional/personal information about the developer
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: Professional information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 professionalName:
 *                   type: string
 *                   example: "Spencer Barbre"
 *                 baseAssignmentGitHubUrl:
 *                   type: string
 *                   example: "https://github.com/username/repo.git"
 *                 currentAssignmentGitHubUrl:
 *                   type: string
 *                   example: "https://github.com/username/repo/tree/main/Week%202"
 *                 whatILearnedInThisAssignment:
 *                   type: string
 *                   example: "Learning summary..."
 *                 githubUsername:
 *                   type: string
 *                   example: "TheBatV2"
 *                 deployedLinks:
 *                   type: object
 *                   properties:
 *                     localhost:
 *                       type: string
 *                       example: "http://localhost:8080"
 *                     render:
 *                       type: string
 *                       example: "https://app.onrender.com"
 */
// Professional endpoint
router.get('/professional', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(professionalData);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Returns the health status of the API server
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: Server is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "Server is running and healthy"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-15T10:30:00.000Z"
 *                 uptime:
 *                   type: number
 *                   example: 12345.67
 */
// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running and healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount route modules
router.use('/contacts', contactsRoute);

module.exports = router;
