exports.getHome = (req, res) => {
  res.send('<h1>Welcome to the Name Server!</h1><p>Visit <a href="/name">/name</a> to see the name.</p>');
};
