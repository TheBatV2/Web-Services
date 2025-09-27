# CSE 341 Assignment - MongoDB Integration

## ✅ Completed Tasks

### 1. **Server Setup**
- ✅ Verified existing server is working
- ✅ Installed MongoDB driver and dotenv packages
- ✅ Updated package.json with proper start script

### 2. **Environment Configuration**
- ✅ Created `.env` file for MongoDB connection string
- ✅ Created `.gitignore` to protect sensitive data
- ✅ Configured dotenv loading in server

### 3. **Database Integration**
- ✅ Created `database/database.js` for MongoDB connection management
- ✅ Updated `server.js` to initialize database connection
- ✅ Added error handling for database connection failures

### 4. **API Endpoints**
- ✅ Created `routes/contacts.js` with two endpoints:
  - `GET /contacts` - Returns all contacts
  - `GET /contacts/:id` - Returns single contact by ID
- ✅ Added proper error handling and validation
- ✅ Integrated routes into main server

### 5. **Testing Setup**
- ✅ Created `contacts.rest` file for REST client testing
- ✅ Created `MONGODB_SETUP.md` with detailed instructions

## 📋 Next Steps (TODO for you):

### 1. **Set up MongoDB Atlas** (5-10 minutes)
Follow the instructions in `MONGODB_SETUP.md`:
- Create MongoDB Atlas account
- Create cluster and database user
- Get connection string
- Update `.env` file with your actual connection string

### 2. **Create Contacts Collection**
Insert these 3 documents into a collection named "contacts":
```json
[
  {
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john.doe@example.com",
    "favoriteColor": "blue",
    "birthday": "1990-05-15"
  },
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com", 
    "favoriteColor": "green",
    "birthday": "1988-09-22"
  },
  {
    "firstName": "Mike",
    "lastName": "Johnson",
    "email": "mike.johnson@example.com",
    "favoriteColor": "red", 
    "birthday": "1992-12-03"
  }
]
```

### 3. **Test Your API**
1. Start your server: `npm start`
2. Use the REST Client extension in VS Code
3. Open `contacts.rest` file
4. Test each endpoint using the "Send Request" links

### 4. **Debug with VS Code**
- Set breakpoints in `routes/contacts.js`
- Start debugging (F5)
- Step through code to understand data flow

### 5. **Deploy to Render**
- Push to GitHub (`.env` won't be pushed due to `.gitignore`)
- Deploy to Render
- Add MONGODB_URI as environment variable in Render dashboard

## 🚀 How to Start Testing:

1. **Update your `.env` file** with real MongoDB connection string
2. **Start the server**: `npm start`
3. **Open `contacts.rest`** in VS Code
4. **Click "Send Request"** above each HTTP request

## 📁 Project Structure:
```
backend/
├── database/
│   └── database.js          # MongoDB connection
├── routes/
│   └── contacts.js          # Contact API routes
├── .env                     # Environment variables (not in git)
├── .gitignore              # Git ignore file
├── contacts.rest           # REST client tests
├── MONGODB_SETUP.md        # MongoDB setup guide
├── package.json            # Dependencies & scripts
└── server.js              # Main server file
```

You're all set! Just need to set up your MongoDB database and test the endpoints.