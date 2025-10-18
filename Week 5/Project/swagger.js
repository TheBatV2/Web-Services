const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Recipe Management API',
    description: 'API for managing recipes with full CRUD operations',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  basePath: '/api',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Recipes',
      description: 'Recipe management endpoints'
    }
  ],
  definitions: {
    Recipe: {
      type: 'object',
      required: ['title', 'description', 'ingredients', 'instructions', 'cookTime', 'difficulty', 'category', 'servings'],
      properties: {
        title: {
          type: 'string',
          example: 'Chocolate Chip Cookies'
        },
        description: {
          type: 'string',
          example: 'Delicious homemade chocolate chip cookies'
        },
        ingredients: {
          type: 'array',
          items: {
            type: 'string'
          },
          example: ['2 cups flour', '1 cup sugar', '1/2 cup chocolate chips']
        },
        instructions: {
          type: 'array',
          items: {
            type: 'string'
          },
          example: ['Mix dry ingredients', 'Add wet ingredients', 'Bake for 12 minutes']
        },
        cookTime: {
          type: 'number',
          example: 25
        },
        difficulty: {
          type: 'string',
          enum: ['Easy', 'Medium', 'Hard'],
          example: 'Easy'
        },
        category: {
          type: 'string',
          enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Breakfast'],
          example: 'Dessert'
        },
        nutrition: {
          type: 'object',
          properties: {
            calories: { type: 'number', example: 250 },
            protein: { type: 'number', example: 3 },
            carbs: { type: 'number', example: 35 },
            fat: { type: 'number', example: 12 }
          }
        },
        tags: {
          type: 'array',
          items: {
            type: 'string'
          },
          example: ['vegetarian', 'dessert', 'baking']
        },
        servings: {
          type: 'number',
          example: 24
        },
        isPublic: {
          type: 'boolean',
          example: true
        }
      }
    },
    Error: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false
        },
        error: {
          type: 'string',
          example: 'Error message'
        },
        details: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
  require('./server.js'); // Start the server after generating docs
});