// Debug script to test environment variables
require('dotenv').config();

console.log('=== ENVIRONMENT VARIABLE DEBUG ===');
console.log('Current working directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
console.log('MONGODB_URI first 50 chars:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + '...' : 'undefined');

// Test MongoDB connection directly
if (process.env.MONGODB_URI) {
  console.log('\n=== TESTING MONGODB CONNECTION ===');
  const { MongoClient } = require('mongodb');
  
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      console.log('✅ MongoDB connection successful!');
      console.log('Database name:', client.db().databaseName);
      client.close();
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
    });
} else {
  console.error('❌ MONGODB_URI environment variable is not set!');
}