const express = require('express');
const upload = require('express-fileupload');
const getRoutes = require('./routes');

module.exports = (logger) => {
  const app = express();
  const routes = getRoutes(logger);

  app.use(upload());
  app.use(routes);

  return app;
};
