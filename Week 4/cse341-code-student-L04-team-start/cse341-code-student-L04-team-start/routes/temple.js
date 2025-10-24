const routes = require('express').Router();
const temples = require('../controllers/temple.js');
const { validateApiKey } = require('../middleware/security');
const { 
  templeValidationRules, 
  templeUpdateValidationRules, 
  templeIdValidationRules, 
  validate 
} = require('../middleware/validation');

// GET all temples (requires API key)
routes.get('/', validateApiKey, temples.findAll);

// GET temple by ID (requires API key and validates temple_id)
routes.get('/:temple_id', validateApiKey, templeIdValidationRules(), validate, temples.findOne);

// CREATE new temple (validates all required fields)
routes.post('/', templeValidationRules(), validate, temples.create);

// UPDATE temple by ID (validates temple_id and optional fields)
routes.put('/:temple_id', templeIdValidationRules(), templeUpdateValidationRules(), validate, temples.update);

// DELETE temple by ID (validates temple_id)
routes.delete('/:temple_id', templeIdValidationRules(), validate, temples.delete);

// DELETE all temples (dangerous operation, might want to add extra protection)
routes.delete('/', temples.deleteAll);

module.exports = routes;
