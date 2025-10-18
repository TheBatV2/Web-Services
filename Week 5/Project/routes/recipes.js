const express = require('express');
const router = express.Router();
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
router.get('/', getRecipes);

// @route   GET /api/recipes/:id
// @desc    Get recipe by ID
// @access  Public
router.get('/:id', getRecipeById);

// @route   POST /api/recipes
// @desc    Create new recipe
// @access  Public (will be protected later)
router.post('/', createRecipe);

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Public (will be protected later)
router.put('/:id', updateRecipe);

// @route   DELETE /api/recipes/:id
// @desc    Delete recipe
// @access  Public (will be protected later)
router.delete('/:id', deleteRecipe);

module.exports = router;