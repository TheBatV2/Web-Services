require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Sample professional data (you can modify this with your actual data)
const professionalData = {
  professionalName: "Spencer Barbre",
  base64Image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==", // Small sample image
  nameLink: {
    firstName: "Spencer",
    url: "https://example.com"
  },
  primaryDescription: " - Full Stack Developer",
  workDescription1: "Passionate software developer with 5+ years of experience in web development.",
  workDescription2: "Specialized in JavaScript, Node.js, React, and database design.",
  linkTitleText: "Connect with me:",
  linkedInLink: {
    text: "LinkedIn Profile",
    link: "https://linkedin.com/in/spencerbarbre"
  },
  githubLink: {
    text: "GitHub Profile", 
    link: "https://github.com/spencerbarbre"
  }
};

// Mock contacts data (for testing without MongoDB)
const mockContacts = [
  {
    _id: "507f1f77bcf86cd799439011",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    favoriteColor: "blue",
    birthday: "1990-05-15"
  },
  {
    _id: "507f1f77bcf86cd799439012",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    favoriteColor: "green",
    birthday: "1988-09-22"
  },
  {
    _id: "507f1f77bcf86cd799439013",
    firstName: "Spencer",
    lastName: "Barbre",
    email: "spencer.barbre@example.com",
    favoriteColor: "purple",
    birthday: "1995-03-10"
  }
];

// Routes
app.get('/professional', (req, res) => {
  try {
    res.json(professionalData);
  } catch (error) {
    console.error('Error serving professional data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Mock Contacts endpoints (for REST client testing)
app.get('/contacts', (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(mockContacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch contacts'
    });
  }
});

app.get('/contacts/:id', (req, res) => {
  try {
    const contact = mockContacts.find(c => c._id === req.params.id);
    
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Professional data available at http://localhost:${PORT}/professional`);
  console.log(`Contacts API available at http://localhost:${PORT}/contacts`);
  console.log('Using MOCK data (MongoDB connection disabled for testing)');
});

module.exports = app;