// Test MongoDB contacts collection
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testContactsCollection() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    console.log('✅ Connected to database:', db.databaseName);
    
    // Check if contacts collection exists
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check contacts collection
    const contactsCollection = db.collection('contacts');
    const contactCount = await contactsCollection.countDocuments();
    console.log(`📊 Contacts collection has ${contactCount} documents`);
    
    if (contactCount > 0) {
      console.log('📋 Existing contacts:');
      const contacts = await contactsCollection.find({}).toArray();
      contacts.forEach((contact, index) => {
        console.log(`  ${index + 1}. ${contact.firstName} ${contact.lastName} (${contact.email})`);
        console.log(`     ID: ${contact._id}`);
      });
    } else {
      console.log('📝 No contacts found. Creating sample contacts...');
      
      const sampleContacts = [
        {
          firstName: "John",
          lastName: "Doe", 
          email: "john.doe@example.com",
          favoriteColor: "blue",
          birthday: "1990-05-15"
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          favoriteColor: "green", 
          birthday: "1988-09-22"
        },
        {
          firstName: "Spencer",
          lastName: "Barbre",
          email: "spencer.barbre@example.com",
          favoriteColor: "purple",
          birthday: "1995-03-10"
        }
      ];
      
      const result = await contactsCollection.insertMany(sampleContacts);
      console.log(`✅ Created ${result.insertedCount} sample contacts`);
      
      // Show the created contacts with their IDs
      const newContacts = await contactsCollection.find({}).toArray();
      console.log('📋 Created contacts:');
      newContacts.forEach((contact, index) => {
        console.log(`  ${index + 1}. ${contact.firstName} ${contact.lastName} (${contact.email})`);
        console.log(`     ID: ${contact._id}`);
      });
    }
    
    await client.close();
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testContactsCollection();