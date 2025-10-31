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
/*
  #swagger.tags = ['Recipes']
  #swagger.summary = 'Create a new recipe'
  #swagger.description = 'Add a new recipe to the database'
  #swagger.security = [{ "cookieAuth": [] }]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Recipe"
        }
      }
    }
  }
  #swagger.responses[201] = {
    description: 'Recipe created successfully',
    content: {
      "application/json": {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Recipe created successfully' },
            data: { $ref: '#/components/schemas/Recipe' }
          }
        }
      }
    }
  }
  #swagger.responses[400] = {
    description: 'Validation error',
    content: {
      "application/json": {
        schema: { $ref: '#/components/schemas/Error' }
      }
    }
  }
*/
router.post('/', requireAuth, createRecipe);

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private (requires authentication and ownership)
/*
  #swagger.tags = ['Recipes']
  #swagger.summary = 'Update an existing recipe'
  #swagger.description = 'Update a recipe by ID (requires ownership)'
  #swagger.security = [{ "cookieAuth": [] }]
  #swagger.parameters['id'] = {
    in: 'path',
    description: 'Recipe ID',
    required: true,
    type: 'string'
  }
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Recipe"
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: 'Recipe updated successfully',
    content: {
      "application/json": {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Recipe updated successfully' },
            data: { $ref: '#/components/schemas/Recipe' }
          }
        }
      }
    }
  }
*/
router.put('/:id', requireAuth, updateRecipe);

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