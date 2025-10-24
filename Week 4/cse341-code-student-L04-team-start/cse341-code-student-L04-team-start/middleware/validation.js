/**
 * Input validation middleware using express-validator
 */
const { body, param, validationResult } = require('express-validator');

// Custom validation rules for temple data
const templeValidationRules = () => {
  return [
    body('temple_id')
      .isInt({ min: 1 })
      .withMessage('Temple ID must be a positive integer')
      .toInt(),
    
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Temple name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Temple name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage('Temple name can only contain letters, spaces, hyphens, and apostrophes')
      .escape(), // Sanitize HTML entities
    
    body('location')
      .trim()
      .notEmpty()
      .withMessage('Location is required')
      .isLength({ min: 2, max: 200 })
      .withMessage('Location must be between 2 and 200 characters')
      .matches(/^[a-zA-Z0-9\s,.\-']+$/)
      .withMessage('Location contains invalid characters')
      .escape(),
    
    body('dedicated')
      .trim()
      .notEmpty()
      .withMessage('Dedication date is required')
      .custom((value) => {
        const dateFormats = [
          /^\d{4}-\d{2}-\d{2}$/,                    // YYYY-MM-DD
          /^\d{2}\/\d{2}\/\d{4}$/,                  // MM/DD/YYYY
          /^[A-Za-z]+\s\d{1,2},\s\d{4}$/           // Month DD, YYYY
        ];
        if (!dateFormats.some(format => format.test(value)) && isNaN(Date.parse(value))) {
          throw new Error('Please provide a valid date format');
        }
        return true;
      }),
    
    body('additionalInfo')
      .optional()
      .isBoolean()
      .withMessage('Additional info must be a boolean value')
      .toBoolean()
  ];
};

// Validation rules for temple update (all fields optional)
const templeUpdateValidationRules = () => {
  return [
    body('temple_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Temple ID must be a positive integer')
      .toInt(),
    
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Temple name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage('Temple name can only contain letters, spaces, hyphens, and apostrophes')
      .escape(),
    
    body('location')
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Location must be between 2 and 200 characters')
      .matches(/^[a-zA-Z0-9\s,.\-']+$/)
      .withMessage('Location contains invalid characters')
      .escape(),
    
    body('dedicated')
      .optional()
      .trim()
      .custom((value) => {
        if (!value) return true; // Skip if empty
        const dateFormats = [
          /^\d{4}-\d{2}-\d{2}$/,
          /^\d{2}\/\d{2}\/\d{4}$/,
          /^[A-Za-z]+\s\d{1,2},\s\d{4}$/
        ];
        if (!dateFormats.some(format => format.test(value)) && isNaN(Date.parse(value))) {
          throw new Error('Please provide a valid date format');
        }
        return true;
      }),
    
    body('additionalInfo')
      .optional()
      .isBoolean()
      .withMessage('Additional info must be a boolean value')
      .toBoolean()
  ];
};

// Validation rules for temple ID parameter
const templeIdValidationRules = () => {
  return [
    param('temple_id')
      .isInt({ min: 1 })
      .withMessage('Temple ID must be a positive integer')
      .toInt()
  ];
};

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorMessages
    });
  }
  next();
};

module.exports = {
  templeValidationRules,
  templeUpdateValidationRules,
  templeIdValidationRules,
  validate
};