const routes = require('express').Router();
const temples = require('../controllers/temple.js');

// GET all temples
routes.get('/', temples.findAll);

// GET temple by ID
routes.get('/:temple_id', temples.findOne);

// CREATE new temple
routes.post('/', temples.create);

// UPDATE temple by ID
routes.put('/:temple_id', temples.update);

// DELETE temple by ID
routes.delete('/:temple_id', temples.delete);

// DELETE all temples
routes.delete('/', temples.deleteAll);

module.exports = routes;
