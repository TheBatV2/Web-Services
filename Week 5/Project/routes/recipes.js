const express = require('express');
const router = express.Router();
const { requireAuth, optionalAuth } = require('../middleware/auth');
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');

// @route   GET /api/recipes
// @desc    Get all recipes (with optional filters)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  /*
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Get all recipes'
    #swagger.description = 'Retrieve all recipes with optional filtering by category, difficulty, or search term'
    #swagger.parameters['category'] = {
      in: 'query',
      description: 'Filter by recipe category',
      required: false,
      type: 'string',
      enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Breakfast']
    }
    #swagger.parameters['difficulty'] = {
      in: 'query',
      description: 'Filter by recipe difficulty',
      required: false,
      type: 'string',
      enum: ['Easy', 'Medium', 'Hard']
    }
    #swagger.parameters['search'] = {
      in: 'query',
      description: 'Search recipes by title or ingredients',
      required: false,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Recipes retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { 
            type: 'array',
            items: { $ref: '#/definitions/Recipe' }
          },
          total: { type: 'number', example: 25 }
        }
      }
    }
  */
  return getRecipes(req, res);
});

// @route   GET /api/recipes/:id
// @desc    Get recipe by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  /*
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Get recipe by ID'
    #swagger.description = 'Retrieve a specific recipe by its ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Recipe ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Recipe retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { $ref: '#/definitions/Recipe' }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Recipe not found',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  return getRecipeById(req, res);
});

// @route   POST /api/recipes
// @desc    Create new recipe
// @access  Private (requires authentication)
router.post('/', requireAuth, async (req, res) => {
  /*
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Create a new recipe'
    #swagger.description = 'Add a new recipe to the database. All fields marked as required must be provided.'
    #swagger.security = [{ "cookieAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Recipe data',
      required: true,
      schema: { $ref: '#/definitions/Recipe' }
    }
    #swagger.responses[201] = {
      description: 'Recipe created successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Recipe created successfully' },
          data: { $ref: '#/definitions/Recipe' }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Validation error',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  return createRecipe(req, res);
});

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private (requires authentication and ownership)
router.put('/:id', requireAuth, async (req, res) => {
  /*
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Update an existing recipe'
    #swagger.description = 'Update a recipe by ID (requires ownership). All fields marked as required must be provided.'
    #swagger.security = [{ "cookieAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Recipe ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated recipe data',
      required: true,
      schema: { $ref: '#/definitions/Recipe' }
    }
    #swagger.responses[200] = {
      description: 'Recipe updated successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Recipe updated successfully' },
          data: { $ref: '#/definitions/Recipe' }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Validation error',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  return updateRecipe(req, res);
});

// @route   DELETE /api/recipes/:id
// @desc    Delete recipe
// @access  Private (requires authentication and ownership)
router.delete('/:id', requireAuth, async (req, res) => {
  /*
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Delete a recipe'
    #swagger.description = 'Delete a recipe by ID (requires ownership)'
    #swagger.security = [{ "cookieAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Recipe ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Recipe deleted successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Recipe deleted successfully' }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Recipe not found',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - user doesn\'t own this recipe',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  return deleteRecipe(req, res);
});

module.exports = router;