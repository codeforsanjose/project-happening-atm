const express = require("express");
const upload = require("express-fileupload");
const getRoutes = require("./routes");
// CORs for allowing cross origin requests
const cors = require("cors");

module.exports = (logger) => {
  const app = express();
  const routes = getRoutes(logger);

  /**
   * CORs for allowing requests from main app
   * for prod, change origin to prod app url
   */
  app.use(
    cors({
      origin: "http://localhost:3001",
    })
  );
  app.use(express.json());
  app.use(upload());
  app.use(routes);

  return app;
};
