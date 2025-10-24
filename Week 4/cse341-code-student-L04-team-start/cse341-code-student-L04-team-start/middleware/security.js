/**
 * Security and authentication middleware
 */
const { AppError } = require('./errorHandler');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// API Key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.header('apiKey') || req.header('x-api-key') || req.query.apiKey;
  const validApiKey = process.env.API_KEY || 
    'Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N';

  if (!apiKey) {
    return next(new AppError('API key is required. Please provide an API key in the header.', 401));
  }

  if (apiKey !== validApiKey) {
    return next(new AppError('Invalid API key. Please check your API key and try again.', 401));
  }

  next();
};

// Rate limiting middleware
const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs, // 15 minutes by default
    max, // limit each IP to max requests per windowMs
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any null bytes
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value.replace(/\0/g, '');
    }
    return value;
  };

  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else {
          obj[key] = sanitizeValue(obj[key]);
        }
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

// Middleware to log API requests
const logRequests = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  next();
};

module.exports = {
  validateApiKey,
  createRateLimit,
  securityHeaders,
  sanitizeInput,
  logRequests
};