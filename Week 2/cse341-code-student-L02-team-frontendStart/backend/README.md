# Professional API Backend

This Node.js backend provides a REST API to serve professional data for the frontend application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on http://localhost:8080

## API Endpoints

### GET /professional
Returns professional data in the following format:

```json
{
  "professionalName": "Spencer Barbre",
  "base64Image": "base64-encoded-image-string",
  "nameLink": {
    "firstName": "Spencer",
    "url": "https://example.com"
  },
  "primaryDescription": " - Full Stack Developer",
  "workDescription1": "Passionate software developer with 5+ years of experience...",
  "workDescription2": "Specialized in JavaScript, Node.js, React...",
  "linkTitleText": "Connect with me:",
  "linkedInLink": {
    "text": "LinkedIn Profile",
    "link": "https://linkedin.com/in/spencerbarbre"
  },
  "githubLink": {
    "text": "GitHub Profile", 
    "link": "https://github.com/spencerbarbre"
  }
}
```

### GET /health
Returns server health status.

## Customization

To customize the professional data, edit the `professionalData` object in `server.js`:

- Replace the `base64Image` with your actual base64-encoded image
- Update all personal information fields
- Modify URLs to point to your actual profiles

## CORS

The server includes CORS middleware to allow requests from the frontend running on different ports.

## Frontend Integration

The frontend expects the API to be running on `http://localhost:8080/professional`. Make sure this matches your server configuration.