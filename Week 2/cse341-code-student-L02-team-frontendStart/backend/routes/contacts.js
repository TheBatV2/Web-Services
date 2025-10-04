const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const database = require('../database/database');

// GET /contacts - Get all contacts
router.get('/', async (req, res) => {
  try {
    const db = database.getDatabase();
    const contacts = await db.collection('contacts').find({}).toArray();
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch contacts'
    });
  }
});

// GET /contacts/:id - Get a single contact by ID
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        error: 'Invalid contact ID format' 
      });
    }

    const db = database.getDatabase();
    const contact = await db.collection('contacts').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!contact) {
      return res.status(404).json({ 
        error: 'Contact not found' 
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch contact'
    });
  }
});

// POST /contacts - Create a new contact
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ 
        error: 'All fields are required',
        required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday']
      });
    }

    // Create new contact object
    const newContact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    };

    const db = database.getDatabase();
    const result = await db.collection('contacts').insertOne(newContact);
    
    if (result.acknowledged) {
      res.status(201).json({ 
        contactId: result.insertedId,
        message: 'Contact created successfully'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to create contact' 
      });
    }
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create contact'
    });
  }
});

// PUT /contacts/:id - Update an existing contact
router.put('/:id', async (req, res) => {
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        error: 'Invalid contact ID format' 
      });
    }

    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ 
        error: 'All fields are required',
        required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday']
      });
    }

    // Create update object
    const updateData = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    };

    const db = database.getDatabase();
    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        error: 'Contact not found' 
      });
    }

    if (result.modifiedCount === 1) {
      res.status(204).send(); // No content - successful update
    } else {
      res.status(200).json({ 
        message: 'Contact was already up to date' 
      });
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update contact'
    });
  }
});

// DELETE /contacts/:id - Delete a contact
router.delete('/:id', async (req, res) => {
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        error: 'Invalid contact ID format' 
      });
    }

    const db = database.getDatabase();
    const result = await db.collection('contacts').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Contact not found' 
      });
    }

    res.status(204).send(); // No content - successful deletion
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete contact'
    });
  }
});

module.exports = router;