const db = require('../models');
const Temple = db.temples;
const { AppError, catchAsync } = require('../middleware/errorHandler');

exports.create = catchAsync(async (req, res, next) => {
  // #swagger.summary = 'Create a new temple'
  // #swagger.description = 'Create a new temple entry in the database'
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Temple data',
    required: true,
    schema: { $ref: '#/definitions/TempleInput' }
  } */
  /* #swagger.responses[201] = {
    description: 'Temple created successfully',
    schema: { $ref: '#/definitions/Temple' }
  } */
  /* #swagger.responses[400] = {
    description: 'Bad request - validation failed',
    schema: { $ref: '#/definitions/Error' }
  } */
  /* #swagger.responses[409] = {
    description: 'Conflict - temple already exists',
    schema: { $ref: '#/definitions/Error' }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { $ref: '#/definitions/Error' }
  } */
  
  try {
    // Check if temple with same temple_id already exists
    const existingTemple = await Temple.findOne({ temple_id: req.body.temple_id });
    if (existingTemple) {
      return next(new AppError(`Temple with ID ${req.body.temple_id} already exists`, 409));
    }

    // Check if temple with same name already exists (case insensitive)
    const existingName = await Temple.findOne({ 
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } 
    });
    if (existingName) {
      return next(new AppError(`Temple with name '${req.body.name}' already exists`, 409));
    }

    // Create new temple
    const temple = new Temple({
      temple_id: req.body.temple_id,
      name: req.body.name,
      location: req.body.location,
      dedicated: req.body.dedicated,
      additionalInfo: req.body.additionalInfo || false
    });

    const savedTemple = await temple.save();

    res.status(201).json({
      success: true,
      message: 'Temple created successfully',
      data: savedTemple
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return next(new AppError(`Validation failed: ${errors.map(e => e.message).join(', ')}`, 400));
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return next(new AppError(`${field} '${value}' already exists`, 409));
    }

    return next(error);
  }
});

exports.findAll = catchAsync(async (req, res, next) => {
  // #swagger.summary = 'Get all temples'
  // #swagger.description = 'Retrieve all temples from the database. Requires API key in header.'
  // #swagger.security = [{ "apiKeyAuth": [] }]
  /* #swagger.parameters['apiKey'] = {
    in: 'header',
    description: 'API key for authentication',
    required: true,
    type: 'string'
  } */
  /* #swagger.responses[200] = {
    description: 'List of all temples',
    schema: { 
      success: true,
      count: 'number',
      data: {
        type: 'array',
        items: { $ref: '#/definitions/Temple' }
      }
    }
  } */
  /* #swagger.responses[401] = {
    description: 'Invalid API key',
    schema: { $ref: '#/definitions/ApiKeyError' }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { $ref: '#/definitions/Error' }
  } */
  
  try {
    // API key validation is now handled by middleware
    const temples = await Temple.find(
      {},
      {
        temple_id: 1,
        name: 1,
        location: 1,
        dedicated: 1,
        additionalInfo: 1,
        _id: 0,
        createdAt: 1,
        updatedAt: 1
      }
    ).sort({ temple_id: 1 }); // Sort by temple_id for consistent ordering

    res.status(200).json({
      success: true,
      count: temples.length,
      data: temples
    });
  } catch (error) {
    return next(new AppError('Error retrieving temples from database', 500));
  }
});

// Find a single Temple with an id
exports.findOne = catchAsync(async (req, res, next) => {
  // #swagger.summary = 'Get temple by ID'
  // #swagger.description = 'Retrieve a specific temple by its temple_id. Requires API key in header.'
  // #swagger.security = [{ "apiKeyAuth": [] }]
  /* #swagger.parameters['temple_id'] = {
    in: 'path',
    description: 'Temple ID',
    required: true,
    type: 'integer'
  } */
  /* #swagger.parameters['apiKey'] = {
    in: 'header',
    description: 'API key for authentication',
    required: true,
    type: 'string'
  } */
  /* #swagger.responses[200] = {
    description: 'Temple found',
    schema: { 
      success: true,
      data: { $ref: '#/definitions/Temple' }
    }
  } */
  /* #swagger.responses[404] = {
    description: 'Temple not found',
    schema: { $ref: '#/definitions/Error' }
  } */
  /* #swagger.responses[401] = {
    description: 'Invalid API key',
    schema: { $ref: '#/definitions/ApiKeyError' }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { $ref: '#/definitions/Error' }
  } */
  
  try {
    const temple_id = parseInt(req.params.temple_id);
    
    // Validation is now handled by middleware, but double-check
    if (!temple_id || temple_id <= 0) {
      return next(new AppError('Invalid temple ID format', 400));
    }

    const temple = await Temple.findOne(
      { temple_id: temple_id },
      {
        temple_id: 1,
        name: 1,
        location: 1,
        dedicated: 1,
        additionalInfo: 1,
        _id: 0,
        createdAt: 1,
        updatedAt: 1
      }
    );

    if (!temple) {
      return next(new AppError(`Temple with ID ${temple_id} not found`, 404));
    }

    res.status(200).json({
      success: true,
      data: temple
    });
  } catch (error) {
    return next(new AppError(`Error retrieving temple with ID ${req.params.temple_id}`, 500));
  }
});

// Update a Temple by the temple_id in the request
exports.update = catchAsync(async (req, res, next) => {
  // #swagger.summary = 'Update temple by ID'
  // #swagger.description = 'Update a temple by its temple_id'
  /* #swagger.parameters['temple_id'] = {
    in: 'path',
    description: 'Temple ID',
    required: true,
    type: 'integer'
  } */
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Temple data to update',
    required: true,
    schema: { $ref: '#/definitions/TempleInput' }
  } */
  /* #swagger.responses[200] = {
    description: 'Temple updated successfully',
    schema: { 
      success: true,
      message: 'Temple was updated successfully.',
      data: { $ref: '#/definitions/Temple' }
    }
  } */
  /* #swagger.responses[400] = {
    description: 'Bad request - validation failed',
    schema: { $ref: '#/definitions/Error' }
  } */
  /* #swagger.responses[404] = {
    description: 'Temple not found',
    schema: { $ref: '#/definitions/Error' }
  } */
  /* #swagger.responses[409] = {
    description: 'Conflict - duplicate data',
    schema: { $ref: '#/definitions/Error' }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { $ref: '#/definitions/Error' }
  } */

  try {
    const temple_id = parseInt(req.params.temple_id);
    
    // Check if there's any data to update
    const updateData = Object.keys(req.body);
    if (updateData.length === 0) {
      return next(new AppError('No data provided for update', 400));
    }

    // Check if temple exists first
    const existingTemple = await Temple.findOne({ temple_id: temple_id });
    if (!existingTemple) {
      return next(new AppError(`Temple with ID ${temple_id} not found`, 404));
    }

    // If updating temple_id, check for duplicates
    if (req.body.temple_id && req.body.temple_id !== temple_id) {
      const duplicateId = await Temple.findOne({ temple_id: req.body.temple_id });
      if (duplicateId) {
        return next(new AppError(`Temple with ID ${req.body.temple_id} already exists`, 409));
      }
    }

    // If updating name, check for duplicates (case insensitive)
    if (req.body.name && req.body.name.toLowerCase() !== existingTemple.name.toLowerCase()) {
      const duplicateName = await Temple.findOne({ 
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
        temple_id: { $ne: temple_id }
      });
      if (duplicateName) {
        return next(new AppError(`Temple with name '${req.body.name}' already exists`, 409));
      }
    }

    // Perform the update
    const updatedTemple = await Temple.findOneAndUpdate(
      { temple_id: temple_id }, 
      req.body, 
      { 
        new: true, 
        runValidators: true,
        projection: {
          temple_id: 1,
          name: 1,
          location: 1,
          dedicated: 1,
          additionalInfo: 1,
          _id: 0,
          createdAt: 1,
          updatedAt: 1
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Temple was updated successfully.',
      data: updatedTemple
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return next(new AppError(`Validation failed: ${errors.map(e => e.message).join(', ')}`, 400));
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return next(new AppError(`${field} '${value}' already exists`, 409));
    }

    return next(new AppError(`Error updating temple with ID ${req.params.temple_id}`, 500));
  }
});
// Delete a Temple with the specified temple_id in the request
exports.delete = catchAsync(async (req, res, next) => {
  // #swagger.summary = 'Delete temple by ID'
  // #swagger.description = 'Delete a temple by its temple_id'
  /* #swagger.parameters['temple_id'] = {
    in: 'path',
    description: 'Temple ID',
    required: true,
    type: 'integer'
  } */
  /* #swagger.responses[200] = {
    description: 'Temple deleted successfully',
    schema: { 
      success: true,
      message: 'Temple was deleted successfully!',
      data: { $ref: '#/definitions/Temple' }
    }
  } */
  /* #swagger.responses[404] = {
    description: 'Temple not found',
    schema: { $ref: '#/definitions/Error' }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { $ref: '#/definitions/Error' }
  } */

  try {
    const temple_id = parseInt(req.params.temple_id);
    
    // Validation is handled by middleware, but double-check
    if (!temple_id || temple_id <= 0) {
      return next(new AppError('Invalid temple ID format', 400));
    }

    const deletedTemple = await Temple.findOneAndDelete(
      { temple_id: temple_id },
      {
        projection: {
          temple_id: 1,
          name: 1,
          location: 1,
          dedicated: 1,
          additionalInfo: 1,
          _id: 0
        }
      }
    );

    if (!deletedTemple) {
      return next(new AppError(`Temple with ID ${temple_id} not found`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Temple was deleted successfully!',
      data: deletedTemple
    });
  } catch (error) {
    return next(new AppError(`Error deleting temple with ID ${req.params.temple_id}`, 500));
  }
});

// Delete all Temples from the database.
exports.deleteAll = catchAsync(async (req, res, next) => {
  // #swagger.summary = 'Delete all temples'
  // #swagger.description = 'Delete all temples from the database. DANGEROUS OPERATION!'
  /* #swagger.responses[200] = {
    description: 'All temples deleted successfully',
    schema: { 
      success: true,
      message: 'X Temples were deleted successfully!',
      deletedCount: 'number'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { $ref: '#/definitions/Error' }
  } */

  try {
    // Add extra confirmation for this dangerous operation
    const confirmationHeader = req.header('confirm-delete-all');
    if (confirmationHeader !== 'YES_DELETE_ALL_TEMPLES') {
      return next(new AppError(
        'This is a destructive operation. Add header "confirm-delete-all: YES_DELETE_ALL_TEMPLES" to confirm.',
        400
      ));
    }

    // Count temples before deletion for confirmation
    const countBeforeDeletion = await Temple.countDocuments();
    
    if (countBeforeDeletion === 0) {
      return res.status(200).json({
        success: true,
        message: 'No temples found to delete',
        deletedCount: 0
      });
    }

    const result = await Temple.deleteMany({});

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} temples were deleted successfully!`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    return next(new AppError('Error occurred while deleting all temples', 500));
  }
});

// // Find all published Temples
// exports.findAllPublished = (req, res) => {
//   Temple.find({ published: true })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || 'Some error occurred while retrieving temple.',
//       });
//     });
// };
