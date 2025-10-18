const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSE 341 Web Services API',
      version: '1.0.0',
      description: 'A comprehensive API for managing contacts and professional information',
      contact: {
        name: 'Spencer Barbre',
        email: 'spencer@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server'
      },
      {
        url: 'https://web-services-jua6.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Contact: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011'
            },
            firstName: {
              type: 'string',
              description: 'First name of the contact',
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'Last name of the contact',
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the contact',
              example: 'john.doe@email.com'
            },
            favoriteColor: {
              type: 'string',
              description: 'Favorite color of the contact',
              example: 'blue'
            },
            birthday: {
              type: 'string',
              description: 'Birthday of the contact (MM/DD/YYYY format)',
              example: '01/15/1990'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Internal server error'
            },
            message: {
              type: 'string',
              description: 'Detailed error message',
              example: 'Failed to process request'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js'] // Include both routes and server.js for Swagger docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;