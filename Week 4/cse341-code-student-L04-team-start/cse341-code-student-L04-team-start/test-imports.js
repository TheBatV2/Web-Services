// Test file to check if all modules load correctly
console.log('Testing imports...');

try {
  console.log('1. Loading express...');
  const express = require('express');
  
  console.log('2. Loading cors...');
  const cors = require('cors');
  
  console.log('3. Loading dotenv...');
  require('dotenv').config();
  
  console.log('4. Loading error handler...');
  const { globalErrorHandler, handleNotFound, AppError } = require('./middleware/errorHandler');
  
  console.log('5. Loading security middleware...');
  const { createRateLimit, securityHeaders } = require('./middleware/security');
  
  console.log('6. Loading models...');
  const db = require('./models');
  
  console.log('7. Loading routes...');
  const routes = require('./routes');
  
  console.log('All imports successful!');
} catch (error) {
  console.error('Import error:', error.message);
  console.error('Stack:', error.stack);
}