const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'LDS Temple API',
    description: 'API for managing LDS temple information for BYU-Idaho WDD230 student projects',
    version: '1.0.0',
  },
  host: 'localhost:8080',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  definitions: {
    Temple: {
      temple_id: 1,
      name: "Example Temple",
      location: "Example City, State, Country",
      dedicated: "1 January 2000",
      additionalInfo: false
    },
    TempleInput: {
      $temple_id: 1,
      $name: "Example Temple",
      $location: "Example City, State, Country",
      dedicated: "1 January 2000",
      additionalInfo: false
    },
    Error: {
      message: "Error message"
    },
    ApiKeyError: {
      message: "Invalid apiKey, please read the documentation."
    }
  },
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'apiKey',
      description: 'API key required for accessing temple data'
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./index.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);