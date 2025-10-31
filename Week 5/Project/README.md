# Recipe Management API

A comprehensive Recipe Management System API built with Node.js, Express, MongoDB, and Google OAuth authentication.

## 🚀 Features

- **Full CRUD Operations** for recipes with user authentication
- **Google OAuth Authentication** for secure user management
- **MongoDB Database** with Mongoose ODM (2 collections: Users & Recipes)
- **User Model** with 10+ fields including dietary preferences and cooking skills
- **Recipe Model** with 7+ fields including nutrition and author tracking
- **Data Validation** with Joi and Mongoose validators
- **Error Handling** with proper HTTP status codes
- **API Documentation** with Swagger/OpenAPI
- **Search & Filter** functionality
- **User Authorization** - users can only modify their own recipes

## 📋 Requirements Met

- ✅ **2+ MongoDB collections** (Users + Recipes)
- ✅ **Recipe collection with 7+ fields** (title, description, ingredients, instructions, cookTime, difficulty, category, servings, author, nutrition, tags, etc.)
- ✅ **User collection with 10+ fields** (googleId, email, name, profilePicture, bio, favoriteRecipes, dietaryPreferences, cookingSkillLevel, isActive, lastLoginAt)
- ✅ **Full CRUD operations** (GET, POST, PUT, DELETE)
- ✅ **Data validation & error handling** with Joi and Mongoose
- ✅ **OAuth authentication** with Google OAuth 2.0
- ✅ **Professional API documentation** with Swagger
- ✅ **Ready for Render deployment**

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
1. Copy `.env.example` to `.env`
2. Update the following in `.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/recipe-management?retryWrites=true&w=majority
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   SESSION_SECRET=your_super_secret_session_key_here
   ```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://your-app-name.onrender.com/api/auth/google/callback`

### 4. Generate API Documentation
```bash
npm run swagger
```

### 5. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Base URL: `/api`

#### Authentication
- `GET /auth/google` - Start Google OAuth login
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/current-user` - Get current user
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/logout` - Logout user

#### Recipes
- `GET /recipes` - Get all recipes (with filters) - **Public**
- `GET /recipes/:id` - Get recipe by ID - **Public**
- `POST /recipes` - Create new recipe - **🔒 Private**
- `PUT /recipes/:id` - Update recipe - **🔒 Private (Owner only)**
- `DELETE /recipes/:id` - Delete recipe - **🔒 Private (Owner only)**

### Query Parameters (Recipes)
- `category` - Filter by category
- `difficulty` - Filter by difficulty
- `search` - Text search in title, description, tags

## 📖 API Documentation

Visit `/api-docs` when the server is running to see interactive Swagger documentation.

## 🗄️ Database Schema

### User Collection (10+ fields)
```javascript
{
  googleId: String (required, unique),
  email: String (required, unique),
  name: String (required),
  profilePicture: String,
  bio: String,
  favoriteRecipes: [ObjectId],
  dietaryPreferences: [String] (Enum),
  cookingSkillLevel: String (Enum),
  isActive: Boolean,
  lastLoginAt: Date,
  timestamps: true
}
```

### Recipe Collection (12+ fields)
```javascript
{
  title: String (required),
  description: String (required),
  ingredients: [String] (required),
  instructions: [String] (required),
  cookTime: Number (required),
  difficulty: Enum ['Easy', 'Medium', 'Hard'] (required),
  category: Enum (required),
  author: ObjectId (required, ref: 'User'),
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  tags: [String],
  servings: Number (required),
  isPublic: Boolean,
  timestamps: true
}
```

## 🚀 Deployment to Render

### Config Variables Needed:
- `MONGODB_URI`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SESSION_SECRET`
- `NODE_ENV=production`
- `CLIENT_URL=https://your-frontend-domain.com`
- `PORT` (automatically set by Render)

## 🧪 Testing the API

### Sample Recipe Data:
```json
{
  "title": "Chocolate Chip Cookies",
  "description": "Classic homemade chocolate chip cookies",
  "ingredients": [
    "2 cups all-purpose flour",
    "1 cup brown sugar",
    "1/2 cup butter",
    "1 cup chocolate chips",
    "2 eggs",
    "1 tsp vanilla extract",
    "1 tsp baking soda",
    "1/2 tsp salt"
  ],
  "instructions": [
    "Preheat oven to 375°F",
    "Mix dry ingredients in a bowl",
    "Cream butter and sugar",
    "Add eggs and vanilla",
    "Combine wet and dry ingredients",
    "Fold in chocolate chips",
    "Drop spoonfuls on baking sheet",
    "Bake for 9-11 minutes"
  ],
  "cookTime": 25,
  "difficulty": "Easy",
  "category": "Dessert",
  "nutrition": {
    "calories": 250,
    "protein": 3,
    "carbs": 35,
    "fat": 12
  },
  "tags": ["vegetarian", "dessert", "baking"],
  "servings": 24,
  "isPublic": true
}
```

## ✅ Week 5 Requirements Complete

- [x] Node.js project created
- [x] MongoDB connection setup (recipe-management database)
- [x] GET and POST routes functional
- [x] All 5 route types in API docs (GET, GET by ID, POST, PUT, DELETE)
- [x] Ready for Render deployment
- [x] Proper error handling and validation