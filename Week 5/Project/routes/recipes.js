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
  #swagger.description = 'Add a new recipe to the database. All fields marked as required must be provided.'
  #swagger.security = [{ "cookieAuth": [] }]
  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Recipe data',
    required: true,
    schema: {
      type: 'object',
      required: ['title', 'description', 'ingredients', 'instructions', 'cookTime', 'difficulty', 'category', 'servings'],
      properties: {
        title: { type: 'string', example: 'Chocolate Chip Cookies' },
        description: { type: 'string', example: 'Delicious homemade chocolate chip cookies' },
        ingredients: { type: 'array', items: { type: 'string' }, example: ['2 cups flour', '1 cup sugar', '1/2 cup chocolate chips', '1/2 cup butter'] },
        instructions: { type: 'array', items: { type: 'string' }, example: ['Mix dry ingredients', 'Add wet ingredients', 'Bake for 12 minutes at 350F'] },
        cookTime: { type: 'number', example: 25 },
        difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'], example: 'Easy' },
        category: { type: 'string', enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Breakfast'], example: 'Dessert' },
        servings: { type: 'number', example: 24 },
        nutrition: { 
          type: 'object', 
          properties: {
            calories: { type: 'number', example: 250 },
            protein: { type: 'number', example: 3 },
            carbs: { type: 'number', example: 35 },
            fat: { type: 'number', example: 12 }
          }
        },
        tags: { type: 'array', items: { type: 'string' }, example: ['vegetarian', 'dessert', 'baking'] },
        isPublic: { type: 'boolean', example: true }
      }
    }
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
router.post('/', requireAuth, createRecipe);

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private (requires authentication and ownership)
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
    schema: {
      type: 'object',
      required: ['title', 'description', 'ingredients', 'instructions', 'cookTime', 'difficulty', 'category', 'servings'],
      properties: {
        title: { type: 'string', example: 'Updated Chocolate Chip Cookies' },
        description: { type: 'string', example: 'Even more delicious homemade chocolate chip cookies' },
        ingredients: { type: 'array', items: { type: 'string' }, example: ['2 cups flour', '1 cup brown sugar', '3/4 cup chocolate chips', '1/2 cup butter'] },
        instructions: { type: 'array', items: { type: 'string' }, example: ['Mix dry ingredients thoroughly', 'Cream butter and sugar', 'Combine all ingredients', 'Bake for 10-12 minutes at 375F'] },
        cookTime: { type: 'number', example: 30 },
        difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'], example: 'Medium' },
        category: { type: 'string', enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Breakfast'], example: 'Dessert' },
        servings: { type: 'number', example: 36 },
        nutrition: { 
          type: 'object', 
          properties: {
            calories: { type: 'number', example: 280 },
            protein: { type: 'number', example: 4 },
            carbs: { type: 'number', example: 40 },
            fat: { type: 'number', example: 14 }
          }
        },
        tags: { type: 'array', items: { type: 'string' }, example: ['vegetarian', 'dessert', 'holiday'] },
        isPublic: { type: 'boolean', example: true }
      }
    }
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