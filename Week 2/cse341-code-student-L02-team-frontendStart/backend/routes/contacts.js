const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const database = require('../database/database');

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     description: Retrieve a list of all contacts from the database
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: List of contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a single contact by ID
 *     description: Retrieve a specific contact using their MongoDB ObjectId
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the contact
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid contact ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid contact ID format"
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contact not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     description: Add a new contact to the database with all required fields
 *     tags:
 *       - Contacts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - favoriteColor
 *               - birthday
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the contact
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Last name of the contact
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the contact
 *                 example: "john.doe@example.com"
 *               favoriteColor:
 *                 type: string
 *                 description: Favorite color of the contact
 *                 example: "blue"
 *               birthday:
 *                 type: string
 *                 description: Birthday in MM/DD/YYYY format
 *                 example: "01/15/1990"
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contactId:
 *                   type: string
 *                   description: ID of the created contact
 *                   example: "507f1f77bcf86cd799439011"
 *                 message:
 *                   type: string
 *                   example: "Contact created successfully"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "All fields are required"
 *                 required:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["firstName", "lastName", "email", "favoriteColor", "birthday"]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update an existing contact
 *     description: Update all fields of an existing contact by ID
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the contact to update
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - favoriteColor
 *               - birthday
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the contact
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Last name of the contact
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the contact
 *                 example: "john.doe@example.com"
 *               favoriteColor:
 *                 type: string
 *                 description: Favorite color of the contact
 *                 example: "blue"
 *               birthday:
 *                 type: string
 *                 description: Birthday in MM/DD/YYYY format
 *                 example: "01/15/1990"
 *     responses:
 *       204:
 *         description: Contact updated successfully (no content)
 *       200:
 *         description: Contact was already up to date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contact was already up to date"
 *       400:
 *         description: Invalid contact ID format or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid contact ID format"
 *                 required:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["firstName", "lastName", "email", "favoriteColor", "birthday"]
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contact not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     description: Remove a contact from the database by ID
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the contact to delete
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       204:
 *         description: Contact deleted successfully (no content)
 *       400:
 *         description: Invalid contact ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid contact ID format"
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contact not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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