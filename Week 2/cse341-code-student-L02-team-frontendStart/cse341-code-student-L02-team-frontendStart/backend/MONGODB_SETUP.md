# Sample Contacts Data for MongoDB

Here are three sample contacts you can insert into your MongoDB collection called "contacts":

## Contact 1:
```json
{
  "firstName": "Stephenie",
  "lastName": "Barbre",
  "email": "Stephbraden@example.com",
  "favoriteColor": "blue",
  "birthday": "1989-09-09"
}
```

## Contact 2:
```json
{
  "firstName": "Zachary",
  "lastName": "Barbre",
  "email": "ZachB@example.com",
  "favoriteColor": "green",
  "birthday": "2020-12-18"
}
```

## Contact 3:
```json
{
  "firstName": "Evelyn",
  "lastName": "Barbre",
  "email": "Ebar@example.com",
  "favoriteColor": "red",
  "birthday": "2022-09-20"
}
```

## MongoDB Atlas Instructions:

1. **Create MongoDB Atlas Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster:**
   - Create a free tier cluster (M0)
   - Choose a cloud provider and region

3. **Create Database User:**
   - Go to Database Access
   - Create a new user with password authentication
   - Grant "Read and write to any database" permissions

4. **Whitelist Your IP:**
   - Go to Network Access
   - Add your current IP address (or 0.0.0.0/0 for development)

5. **Get Connection String:**
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your user password
   - Replace `<dbname>` with your database name (e.g., "cse341")

6. **Update .env File:**
   - Replace the placeholder in your .env file with the actual connection string

7. **Create Collection:**
   - Use MongoDB Compass or the web interface
   - Create a database (e.g., "cse341")
   - Create a collection called "contacts"
   - Insert the three sample documents above

## Example Connection String:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.abcde.mongodb.net/cse341?retryWrites=true&w=majority
```