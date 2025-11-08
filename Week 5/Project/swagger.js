const swaggerAutogen = require('swagger-autogen')();

// Dynamic host based on environment - more explicit detection
let host, schemes;

// Auto-detect environment first
const isRender = process.env.RENDER_URL || 
                 process.env.RENDER_SERVICE_ID || 
                 process.env.RENDER || 
                 process.env.NODE_ENV === 'production' ||
                 (process.env.PORT && process.env.PORT !== '3000');

// Check for explicit SWAGGER_HOST environment variable first
if (process.env.SWAGGER_HOST) {
  host = process.env.SWAGGER_HOST;
  // If it's the Render domain, use HTTPS; otherwise detect from the host string
  schemes = (host.includes('onrender.com') || host.includes('https')) ? ['https'] : ['http'];
  console.log(`📝 Swagger Generation - Using explicit SWAGGER_HOST: ${host}, Schemes: ${schemes.join(', ')}`);
} else {
  host = isRender 
    ? 'recipe-project-f7mh.onrender.com'
    : `localhost:${process.env.PORT || 3000}`;

  schemes = isRender ? ['https'] : ['http'];
  console.log(`📝 Swagger Generation - Auto-detected Host: ${host}, Environment: ${isRender ? 'Production' : 'Development'}`);
}

console.log(`📝 Swagger Generation - Final Host: ${host}, Schemes: ${schemes.join(', ')}`);

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
    googleOAuth2: {
      type: 'oauth2',
      description: 'Google OAuth2 authentication. Click "Authorize" to login with Google.',
      flow: 'authorizationCode',
      authorizationUrl: isRender 
        ? 'https://recipe-project-f7mh.onrender.com/api/auth/google'
        : `http://localhost:${process.env.PORT || 3000}/api/auth/google`,
      tokenUrl: isRender 
        ? 'https://recipe-project-f7mh.onrender.com/api/auth/google/token'
        : `http://localhost:${process.env.PORT || 3000}/api/auth/google/token`,
      scopes: {
        'openid': 'OpenID Connect',
        'profile': 'Access user profile',
        'email': 'Access user email'
      }
    },
    cookieAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
      description: 'Session cookie authentication (automatically set after OAuth login)'
    }
  },
  security: [
    {
      googleOAuth2: ['openid', 'profile', 'email']
    },
    {
      cookieAuth: []
    }
  ],
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
const endpointsFiles = ['./routes/recipes.js', './routes/auth.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
  
  // Post-process to fix paths
  const fs = require('fs');
  const swaggerDoc = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
  
  const newPaths = {};
  
  // Fix recipe paths
  Object.keys(swaggerDoc.paths).forEach(path => {
    if (path.startsWith('/')) {
      // For routes from recipes.js, add /api/recipes prefix
      if (swaggerDoc.paths[path].get?.tags?.[0] === 'Recipes' || 
          swaggerDoc.paths[path].post?.tags?.[0] === 'Recipes' ||
          swaggerDoc.paths[path].put?.tags?.[0] === 'Recipes' ||
          swaggerDoc.paths[path].delete?.tags?.[0] === 'Recipes') {
        const newPath = path === '/' ? '/api/recipes/' : `/api/recipes${path}`;
        newPaths[newPath] = swaggerDoc.paths[path];
      }
      // For routes from auth.js, add /api/auth prefix  
      else if (swaggerDoc.paths[path].get?.tags?.[0] === 'Authentication' || 
               swaggerDoc.paths[path].post?.tags?.[0] === 'Authentication' ||
               swaggerDoc.paths[path].put?.tags?.[0] === 'Authentication' ||
               swaggerDoc.paths[path].delete?.tags?.[0] === 'Authentication') {
        const newPath = path === '/' ? '/api/auth/' : `/api/auth${path}`;
        newPaths[newPath] = swaggerDoc.paths[path];
      }
      // Keep other paths as-is
      else {
        newPaths[path] = swaggerDoc.paths[path];
      }
    } else {
      newPaths[path] = swaggerDoc.paths[path];
    }
  });
  
  swaggerDoc.paths = newPaths;
  
  fs.writeFileSync(outputFile, JSON.stringify(swaggerDoc, null, 2));
  console.log('✅ Paths fixed successfully!');
});