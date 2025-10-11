const db = require('../models');
const Temple = db.temples;

const apiKey =
  'Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N';

exports.create = (req, res) => {
  // #swagger.summary = 'Create a new temple'
  // #swagger.description = 'Create a new temple entry in the database'
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Temple data',
    required: true,
    schema: { $ref: '#/definitions/TempleInput' }
  } */
  /* #swagger.responses[200] = {
    description: 'Temple created successfully',
    schema: { $ref: '#/definitions/Temple' }
  } */
  /* #swagger.responses[400] = {
    description: 'Bad request - missing required fields',
    schema: { $ref: '#/definitions/Error' }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { $ref: '#/definitions/Error' }
  } */
  
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  // Create a Temple
  const temple = new Temple({
    temple_id: req.body.temple_id,
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
  });
  // Save Temple in the database
  temple
    .save(temple)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Temple.',
      });
    });
};

exports.findAll = (req, res) => {
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
      type: 'array',
      items: { $ref: '#/definitions/Temple' }
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
  
  console.log(req.header('apiKey'));
  if (req.header('apiKey') === apiKey) {
    Temple.find(
      {},
      {
        temple_id: 1,
        name: 1,
        location: 1,
        dedicated: 1,
        additionalInfo: 1,
        _id: 0,
      }
    )
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving temples.',
        });
      });
  } else {
    res.send('Invalid apiKey, please read the documentation.');
  }
};

// Find a single Temple with an id
exports.findOne = (req, res) => {
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
    schema: { $ref: '#/definitions/Temple' }
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
  
  const temple_id = req.params.temple_id;
  if (req.header('apiKey') === apiKey) {
    Temple.find({ temple_id: temple_id })
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({ message: 'Not found Temple with id ' + temple_id });
        else res.send(data[0]);
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error retrieving Temple with temple_id=' + temple_id,
        });
      });
  } else {
    res.send('Invalid apiKey, please read the documentation.');
  }
};

// Update a Temple by the temple_id in the request
exports.update = (req, res) => {
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
    schema: { message: 'Temple was updated successfully.' }
  } */
  /* #swagger.responses[400] = {
    description: 'Bad request - no data provided',
    schema: { $ref: '#/definitions/Error' }
  } */
  /* #swagger.responses[404] = {
    description: 'Temple not found',
    schema: { $ref: '#/definitions/Error' }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { $ref: '#/definitions/Error' }
  } */

  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }

  const temple_id = req.params.temple_id;

  Temple.findOneAndUpdate({ temple_id: temple_id }, req.body, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Temple with temple_id=${temple_id}. Maybe Temple was not found!`,
        });
      } else res.send({ message: 'Temple was updated successfully.' });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Temple with temple_id=' + temple_id,
      });
    });
};
// Delete a Temple with the specified temple_id in the request
exports.delete = (req, res) => {
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
    schema: { message: 'Temple was deleted successfully!' }
  } */
  /* #swagger.responses[404] = {
    description: 'Temple not found',
    schema: { $ref: '#/definitions/Error' }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { $ref: '#/definitions/Error' }
  } */

  const temple_id = req.params.temple_id;

  Temple.findOneAndDelete({ temple_id: temple_id })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Temple with temple_id=${temple_id}. Maybe Temple was not found!`,
        });
      } else {
        res.send({
          message: 'Temple was deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Temple with temple_id=' + temple_id,
      });
    });
};

// Delete all Temples from the database.
exports.deleteAll = (req, res) => {
  // #swagger.summary = 'Delete all temples'
  // #swagger.description = 'Delete all temples from the database'
  /* #swagger.responses[200] = {
    description: 'All temples deleted successfully',
    schema: { message: 'X Temples were deleted successfully!' }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { $ref: '#/definitions/Error' }
  } */

  Temple.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Temples were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all temples.',
      });
    });
};

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
