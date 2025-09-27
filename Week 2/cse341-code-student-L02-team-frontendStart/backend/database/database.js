const { MongoClient } = require('mongodb');

let database;

const initDb = (callback) => {
  if (database) {
    console.log('Database is already initialized!');
    return callback(null, database);
  }
  
  // MongoDB connection options for better SSL handling
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

  // Add SSL options for production environments
  if (process.env.NODE_ENV === 'production') {
    options.ssl = true;
    options.tlsAllowInvalidCertificates = true;
    options.tlsAllowInvalidHostnames = true;
  }
  
  MongoClient.connect(process.env.MONGODB_URI, options)
    .then((client) => {
      database = client.db();
      console.log('Connected to MongoDB successfully!');
      callback(null, database);
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      callback(err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database;
};

module.exports = {
  initDb,
  getDatabase
};