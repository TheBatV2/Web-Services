const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
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