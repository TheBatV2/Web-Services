# 🔐 Swagger OAuth Authentication Guide

## ✅ **Working with OAuth in Swagger (Local & Online)**

### **Quick Access URLs:**

#### **Local Development:**
- **Swagger UI**: http://localhost:3000/api-docs
- **OAuth Login**: http://localhost:3000/api/auth/google
- **Auth Status**: http://localhost:3000/api/auth/current-user

#### **Production (Render):**
- **Swagger UI**: https://recipe-project-f7mh.onrender.com/api-docs
- **OAuth Login**: https://recipe-project-f7mh.onrender.com/api/auth/google
- **Auth Status**: https://recipe-project-f7mh.onrender.com/api/auth/current-user

### **Method 1: Complete OAuth Flow in Swagger** (Recommended for Demo)

1. **Step 1: Start Authentication**
   - In Swagger UI, find `GET /api/auth/google`
   - Click **"Try it out"** → **"Execute"**
   - Your browser will redirect to Google OAuth
   - Complete Google login process
   - You'll be redirected back to your app

2. **Step 2: Verify Authentication**
   - Return to Swagger UI (refresh if needed)
   - Try `GET /api/auth/current-user`
   - Click **"Try it out"** → **"Execute"**
   - ✅ **Success**: See your user data → You're authenticated!
   - ❌ **401 Error**: Repeat Step 1

3. **Step 3: Use Protected Endpoints**
   - Now try `POST /api/recipes` with sample data
   - Try `PUT /api/recipes/{id}` to update
   - Try `DELETE /api/recipes/{id}` to delete
   - All should work without authentication errors!

### **Method 2: Quick Authentication Check**

**Before testing protected endpoints, always check:**
```
GET /api/auth/current-user
```
- **200 response**: ✅ Authenticated - proceed with testing
- **401 response**: ❌ Not authenticated - login first

### **Perfect Demo Video Flow:**

#### **For Local Development:**
```
1. Open Swagger: http://localhost:3000/api-docs
2. Try GET /api/auth/current-user → 401 Error ❌
3. Navigate to: http://localhost:3000/api/auth/google → Login with Google ✅  
4. Return to Swagger → Try GET /api/auth/current-user → See user data ✅
5. Try POST /api/recipes → Success! ✅
6. Try PUT /api/recipes/{id} → Success! ✅
7. Try DELETE /api/recipes/{id} → Success! ✅
```

#### **For Production (Render):**
```
1. Open Swagger: https://recipe-project-f7mh.onrender.com/api-docs
2. Try GET /api/auth/current-user → 401 Error ❌
3. Navigate to: https://recipe-project-f7mh.onrender.com/api/auth/google → Login ✅
4. Return to Swagger → Try GET /api/auth/current-user → See user data ✅
5. Try POST /api/recipes → Success! ✅
6. Try PUT /api/recipes/{id} → Success! ✅
7. Try DELETE /api/recipes/{id} → Success! ✅
```

## 🌐 **For Online Deployment (Render)**

**Same process works online:**
- Your Render URL: `https://recipe-project-f7mh.onrender.com/api-docs`
- OAuth: `https://recipe-project-f7mh.onrender.com/api/auth/google`
- Everything works the same way!

## 🧪 **Sample Recipe for Testing:**

```json
{
  "title": "Swagger Test Recipe",
  "description": "Testing OAuth authentication in Swagger",
  "ingredients": ["1 cup flour", "2 eggs", "1 cup milk"],
  "instructions": ["Mix ingredients", "Cook for 20 minutes"],
  "cookTime": 25,
  "difficulty": "Easy",
  "category": "Dessert",
  "servings": 4,
  "nutrition": {
    "calories": 200,
    "protein": 8,
    "carbs": 30,
    "fat": 5
  },
  "tags": ["test", "oauth", "swagger"],
  "isPublic": true
}
```

## 🎯 **Authentication States in Swagger:**

| Endpoint | Not Authenticated | Authenticated |
|----------|------------------|---------------|
| `GET /api/recipes` | ✅ Works (public) | ✅ Works |
| `GET /api/auth/current-user` | ❌ 401 Error | ✅ User data |
| `POST /api/recipes` | ❌ 401 Error | ✅ Creates recipe |
| `PUT /api/recipes/{id}` | ❌ 401 Error | ✅ Updates recipe |
| `DELETE /api/recipes/{id}` | ❌ 401 Error | ✅ Deletes recipe |

## 🚀 **Pro Tips for Demo:**

1. **Start with failure** - show 401 errors first
2. **Show the login process** - click the OAuth endpoint
3. **Verify success** - check current-user endpoint
4. **Demonstrate CRUD** - create, update, delete recipes
5. **Show ownership** - try to modify another user's recipe (403 error)

**This gives you a complete OAuth demonstration entirely within Swagger! 🎉**