const swaggerAutogen = require('swagger-autogen')();

// Dynamic host based on environment
const isRender = process.env.RENDER_URL || 
                 process.env.RENDER_SERVICE_ID || 
                 process.env.RENDER || 
                 process.env.NODE_ENV === 'production' ||
                 (process.env.PORT && process.env.PORT !== '3000');

const host = isRender 
  ? 'recipe-project-f7mh.onrender.com'
  : `localhost:${process.env.PORT || 3000}`;

const schemes = isRender ? ['https'] : ['http'];

console.log(`📝 Swagger Generation - Host: ${host}, Schemes: ${schemes.join(', ')}`);

const doc = {
  info: {
    title: 'Recipe Management API',
    description: 'API for managing recipes with full CRUD operations and OAuth authentication',
    version: '1.0.0',
  },
  host: host,
  schemes: schemes,
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication endpoints'
    },
    {
      name: 'Recipes',
      description: 'Recipe management endpoints'
    }
  ],
  securityDefinitions: {
    cookieAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid'
    }
  },
  definitions: {
    User: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: '507f1f77bcf86cd799439011'
        },
        googleId: {
          type: 'string',
          example: '123456789012345678901'
        },
        email: {
          type: 'string',
          example: 'user@example.com'
        },
        name: {
          type: 'string',
          example: 'John Doe'
        },
        profilePicture: {
          type: 'string',
          example: 'https://example.com/profile.jpg'
        },
        bio: {
          type: 'string',
          example: 'Food enthusiast and home cook'
        },
        favoriteRecipes: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        dietaryPreferences: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        cookingSkillLevel: {
          type: 'string',
          example: 'Intermediate'
        },
        isActive: {
          type: 'boolean',
          example: true
        },
        createdAt: {
          type: 'string',
          format: 'date-time'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time'
        }
      }
    },
    Recipe: {
      type: 'object',
      required: ['title', 'description', 'ingredients', 'instructions', 'cookTime', 'difficulty', 'category', 'servings'],
      properties: {
        _id: {
          type: 'string',
          example: '507f1f77bcf86cd799439012'
        },
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
        author: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' }
          }
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
        },
        createdAt: {
          type: 'string',
          format: 'date-time'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time'
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

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
});