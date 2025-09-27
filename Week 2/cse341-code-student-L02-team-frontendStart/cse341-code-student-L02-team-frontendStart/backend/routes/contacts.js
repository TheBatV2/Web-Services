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

module.exports = router;