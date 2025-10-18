/**
 * Error handling middleware for the CSE 341 Web Services API
 * Provides consistent error responses across all endpoints
 */

// 404 Not Found middleware - handles routes that don't exist
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  // Set status code if not already set
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  // Handle specific MongoDB errors
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    err.message = 'Invalid ID format';
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }
  
  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
  }
  
  // Send error response
  res.status(statusCode).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

module.exports = {
  notFound,
  errorHandler
};