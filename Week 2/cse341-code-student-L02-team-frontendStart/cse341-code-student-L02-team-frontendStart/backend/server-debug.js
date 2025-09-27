require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./database/database');

console.log('🚀 Starting server...');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
console.log('📦 Setting up middleware...');
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

// Load contacts routes
console.log('📋 Loading contacts routes...');
try {
  const contactsRoute = require('./routes/contacts');
  app.use('/contacts', contactsRoute);
  console.log('✅ Contacts routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load contacts routes:', error.message);
  console.error('Full error:', error);
}

// Initialize database and start server
console.log('🗄️ Initializing database...');
database.initDb((err, db) => {
  if (err) {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`\n🎉 Server is running on port ${PORT}`);
    console.log(`📋 Professional data: http://localhost:${PORT}/professional`);
    console.log(`💾 Contacts API: http://localhost:${PORT}/contacts`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    console.log('\n🧪 Ready for testing with REST Client!');
  });
});

module.exports = app;