const Recipe = require('../models/Recipe');
const Joi = require('joi');

// Validation schema for recipes
const recipeValidationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).required(),
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
  instructions: Joi.array().items(Joi.string()).min(1).required(),
  cookTime: Joi.number().min(1).max(600).required(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required(),
  category: Joi.string().valid('Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Breakfast').required(),
  nutrition: Joi.object({
    calories: Joi.number().min(0),
    protein: Joi.number().min(0),
    carbs: Joi.number().min(0),
    fat: Joi.number().min(0)
  }),
  tags: Joi.array().items(Joi.string()),
  servings: Joi.number().min(1).max(50).required(),
  isPublic: Joi.boolean()
});

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let filter = { isPublic: true };

    // Add filters if provided
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$text = { $search: search };
    }

    const recipes = await Recipe.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching recipes'
    });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name email');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipe ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error while fetching recipe'
    });
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private (requires authentication)
const createRecipe = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to create recipes'
      });
    }

    // Validate input
    const { error, value } = recipeValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    // Create recipe with author
    const recipeData = {
      ...value,
      author: req.user._id
    };
    
    const recipe = await Recipe.create(recipeData);

    // Populate author info for response
    await recipe.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: recipe
    });
  } catch (error) {
    console.error('Error creating recipe:', error);

    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: messages
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error while creating recipe'
    });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private (requires authentication and ownership)
const updateRecipe = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to update recipes'
      });
    }

    // Find recipe first to check ownership
    const existingRecipe = await Recipe.findById(req.params.id);
    if (!existingRecipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    // Check if user owns the recipe
    if (existingRecipe.author && existingRecipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only update your own recipes.'
      });
    }

    // Validate input
    const { error, value } = recipeValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      value,
      {
        new: true,
        runValidators: true
      }
    ).populate('author', 'name email');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    // Return 204 No Content for successful update (mastery level requirement)
    res.status(204).send();
  } catch (error) {
    console.error('Error updating recipe:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipe ID format'
      });
    }

    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: messages
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error while updating recipe'
    });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private (requires authentication and ownership)
const deleteRecipe = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to delete recipes'
      });
    }

    // Find recipe first to check ownership
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    // Check if user owns the recipe
    if (recipe.author && recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only delete your own recipes.'
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipe ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error while deleting recipe'
    });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
};