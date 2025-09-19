const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const nameRoute = require('./routes/name');
const homeRoute = require('./routes/home');

app.use('/', homeRoute);
app.use('/name', nameRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
