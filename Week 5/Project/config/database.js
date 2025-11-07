const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Only attempt connection if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  No MONGODB_URI provided - running without database');
      console.log('⚠️  Database operations will not be available');
      return;
    }

    // Set connection timeout
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server will continue running without database connection');
    console.log('⚠️  Database operations will fail until MongoDB is accessible');
    // Don't exit the process - allow server to run for OAuth testing
  }
};

module.exports = connectDB;