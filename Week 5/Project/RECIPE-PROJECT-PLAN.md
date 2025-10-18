# Recipe Management API - Project Plan

## Project Overview
Building a Recipe Management System API with Node.js, MongoDB, OAuth, and full CRUD operations.

## Core Requirements
- **2+ MongoDB collections** (Users + Recipes)
- **At least one collection with 7+ fields** (Recipes)
- **Full CRUD operations** (GET, POST, PUT, DELETE)
- **Data validation & error handling** for all routes
- **OAuth user management** 
- **Professional API documentation** (Swagger)
- **Render deployment** with config vars
- **YouTube demo video** (~1 minute)

## Extra Credit Options
- **GraphQL instead of REST** (+20%)
- **TypeScript for entire project** (+20%)

## Detailed Rubric

### Deployed to the Web — 20%
- **Mastery**: Video shows Render CONFIG VARS for MongoDB connection
- **Proficient**: App connects to MongoDB
- **Developing**: Render URL opens without errors
- **Beginning**: Node.js app deployed to Render

### OAuth — 20%
- **Mastery**: Video shows protected routes require authentication
- **Proficient**: User can log out using OAuth
- **Developing**: User can log in using OAuth
- **Beginning**: Evidence of OAuth in project

### Database — 15%
- **Mastery**: At least one collection with 7+ fields
- **Proficient**: Database has 2+ collections
- **Developing**: Database has single collection
- **Beginning**: Database exists

### HTTP Requests — 15%
- **Mastery**: 2+ collections have PUT/DELETE (shown in video)
- **Proficient**: 2+ collections have POST (shown in video)
- **Developing**: One HTTP request per collection
- **Beginning**: Several HTTP requests work

### API Documentation — 10%
- **Mastery**: Documentation can test all endpoints
- **Proficient**: Documentation published to /api-docs
- **Developing**: Documentation organized by collection
- **Beginning**: swagger.json file present

### Data Validation — 10%
- **Mastery**: Each route has validation, returns 400/500 errors
- **Proficient**: Validation for PUT/DELETE routes
- **Developing**: Validation for GET/POST routes
- **Beginning**: Evidence of data validation

### Error Handling — 10%
- **Mastery**: Each route has error handling, returns proper status codes
- **Proficient**: Error handling for PUT/DELETE routes
- **Developing**: Error handling for GET/POST routes
- **Beginning**: At least one try/catch

## Recommended Project Structure

### Collection 1: Users
```javascript
{
  _id: ObjectId,
  googleId: String, // OAuth
  email: String,
  name: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection 2: Recipes (7+ fields)
```javascript
{
  _id: ObjectId,
  title: String, // required
  description: String,
  ingredients: [String], // array of ingredients
  instructions: [String], // step-by-step
  cookTime: Number, // minutes
  difficulty: String, // Easy, Medium, Hard
  category: String, // Dessert, Main, Appetizer, etc.
  author: ObjectId, // ref to User
  dateCreated: Date,
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  tags: [String], // vegetarian, gluten-free, etc.
  servings: Number,
  isPublic: Boolean // for OAuth protection
}
```

## Required API Routes

### User Routes (OAuth Protected)
- GET /users/profile - Get current user
- PUT /users/profile - Update user profile
- POST /auth/google - Google OAuth login
- GET /auth/logout - Logout

### Recipe Routes
- GET /recipes - Get all public recipes
- GET /recipes/:id - Get recipe by ID
- POST /recipes - Create new recipe (protected)
- PUT /recipes/:id - Update recipe (protected, owner only)
- DELETE /recipes/:id - Delete recipe (protected, owner only)
- GET /recipes/user/:userId - Get user's recipes
- GET /recipes/search?category=dessert - Search recipes

## Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with Google OAuth 2.0
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Render
- **Environment**: dotenv for config

## Initial Setup Steps
1. Create new Node.js project
2. Install dependencies: express, mongoose, passport, passport-google-oauth20, express-session, cors, dotenv, swagger-ui-express, swagger-autogen
3. Set up folder structure: controllers/, routes/, models/, middleware/, config/
4. Configure MongoDB connection
5. Set up Google OAuth application
6. Create basic server and routes
7. Implement first GET and POST routes
8. Set up Swagger documentation
9. Deploy to Render with config vars
10. Create demo video

## Environment Variables Needed
```
MONGODB_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SESSION_SECRET=...
NODE_ENV=production
```

## Demo Video Checklist
- Show API documentation at /api-docs
- Test each CRUD operation
- Show MongoDB changes in real-time
- Demonstrate OAuth login/logout
- Show protected routes requiring authentication
- Test data validation and error handling

## Success Criteria
- All routes functional and documented
- OAuth working with protected routes
- Database with 2 collections, recipes having 7+ fields
- Proper validation and error handling
- Deployed to Render with config vars
- Professional video demonstration

---

**When you start in the new window, just mention "Recipe Management API project" and reference this plan!**