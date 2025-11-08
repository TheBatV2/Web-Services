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
router.get('/', optionalAuth, getRecipes);

// @route   GET /api/recipes/:id
// @desc    Get recipe by ID
// @access  Public
router.get('/:id', optionalAuth, getRecipeById);

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
*/
router.delete('/:id', requireAuth, deleteRecipe);

module.exports = router;