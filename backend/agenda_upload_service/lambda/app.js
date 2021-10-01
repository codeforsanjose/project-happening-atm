const express = require('express');
const upload = require('express-fileupload');
const getRoutes = require('./routes');
// CORs for allowing cross origin requests
const cors = require('cors');

module.exports = (logger) => {
  const app = express();
  const routes = getRoutes(logger);

  // CORs for allowing cross origin requests
  app.use(cors())

  app.use(upload());
  app.use(routes);

  return app;
};