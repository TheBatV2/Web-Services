# Recipe Management API

A comprehensive Recipe Management System API built with Node.js, Express, MongoDB, and OAuth authentication.

## 🚀 Features

- **Full CRUD Operations** for recipes
- **MongoDB Database** with Mongoose ODM
- **Data Validation** with Joi
- **Error Handling** with proper HTTP status codes
- **API Documentation** with Swagger/OpenAPI
- **Search & Filter** functionality
- **Ready for OAuth** integration

## 📋 Requirements Met

- ✅ 2+ MongoDB collections (Users + Recipes)
- ✅ Recipe collection with 7+ fields
- ✅ Full CRUD operations (GET, POST, PUT, DELETE)
- ✅ Data validation & error handling
- ✅ Professional API documentation
- ✅ Ready for Render deployment

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
1. Copy `.env.example` to `.env`
2. Update MongoDB credentials in `.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/recipe-management?retryWrites=true&w=majority
   ```

### 3. Generate API Documentation
```bash
npm run swagger
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Base URL: `/api`

#### Recipes
- `GET /recipes` - Get all recipes (with filters)
- `GET /recipes/:id` - Get recipe by ID
- `POST /recipes` - Create new recipe
- `PUT /recipes/:id` - Update recipe
- `DELETE /recipes/:id` - Delete recipe

### Query Parameters
- `category` - Filter by category
- `difficulty` - Filter by difficulty
- `search` - Text search in title, description, tags

## 📖 API Documentation

Visit `/api-docs` when the server is running to see interactive Swagger documentation.

## 🗄️ Database Schema

### Recipe Collection (7+ fields)
```javascript
{
  title: String (required),
  description: String (required),
  ingredients: [String] (required),
  instructions: [String] (required),
  cookTime: Number (required),
  difficulty: Enum ['Easy', 'Medium', 'Hard'] (required),
  category: Enum (required),
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
- `NODE_ENV=production`
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