const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Route that returns a name
app.get('/name', (req, res) => {
  res.send('Stephenie Barbre');
});

// Root route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Name Server!</h1><p>Visit <a href="/name">/name</a> to see the name.</p>');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
