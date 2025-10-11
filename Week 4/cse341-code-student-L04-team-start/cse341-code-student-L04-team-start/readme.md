# LDS Temple API

A REST API for managing LDS temple information, built with Node.js, Express, and MongoDB.

## Features

- Full CRUD operations for temple data
- API key authentication for read operations
- Swagger/OpenAPI documentation
- MongoDB integration with Mongoose

## Setup Instructions

### 1. Environment Configuration

Update the `.env` file with your MongoDB connection string:

```env
# For MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/temples

# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/temples

PORT=8080
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Import Temple Data

Import the temple data from `temples.json` into your MongoDB database:

```bash
npm run import
```

### 4. Generate Swagger Documentation

Generate the Swagger/OpenAPI documentation:

```bash
npm run swagger
```

### 5. Start the Server

```bash
npm start
```

The server will start on `http://localhost:8080` and the Swagger documentation will be available at `http://localhost:8080/api-docs`.

## API Endpoints

### Temple Operations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/temples` | Get all temples | Yes (API Key) |
| GET | `/temples/:temple_id` | Get temple by ID | Yes (API Key) |
| POST | `/temples` | Create new temple | No |
| PUT | `/temples/:temple_id` | Update temple by ID | No |
| DELETE | `/temples/:temple_id` | Delete temple by ID | No |
| DELETE | `/temples` | Delete all temples | No |

### Authentication

For GET operations, include the API key in the request header:

```
apiKey: Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N
```

## Temple Data Structure

```json
{
  "temple_id": 1,
  "name": "Aba Nigeria Temple",
  "location": "Aba, Abia, Nigeria",
  "dedicated": "7 August 2005",
  "additionalInfo": false
}
```

## Testing with Swagger UI

1. Start the server with `npm start`
2. Open `http://localhost:8080/api-docs` in your browser
3. Use the "Try it out" feature to test each endpoint
4. For endpoints requiring authentication, add the API key in the "apiKey" header

## Development Notes

- The API key is currently hardcoded in the controller for educational purposes
- In production, use proper authentication mechanisms
- The database connection uses local MongoDB by default - update for your environment
- Run `npm run swagger` whenever you modify route documentation
