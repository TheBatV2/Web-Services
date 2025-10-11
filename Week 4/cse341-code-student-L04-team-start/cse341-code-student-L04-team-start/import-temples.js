const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function importTemples() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('temples');
    const collection = db.collection('temples');

    // Read temples.json file
    const templesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'temples.json'), 'utf8'));

    // Clean the data by removing MongoDB-specific fields and converting ObjectIds
    const cleanData = templesData.map(temple => {
      const cleanTemple = { ...temple };
      
      // Remove the _id field with $oid (let MongoDB generate new ones)
      if (cleanTemple._id && cleanTemple._id.$oid) {
        delete cleanTemple._id;
      }
      
      return cleanTemple;
    });

    // Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing temple data');

    // Insert new data
    const result = await collection.insertMany(cleanData);
    console.log(`Inserted ${result.insertedCount} temples into the database`);

  } catch (error) {
    console.error('Error importing temples:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the import
importTemples();