require('dotenv').config();
const path = require("path");
const express = require("express");
const apiResponse = require("./utilities/apiResponse");
const PORT = process.env.PORT || 3000;

// Dependencies
const logger = require("./utilities/logger");
const dbClient = require("./db/dbClient")(logger);
const twilioClient = require("./twilio/twilioClient")(logger);

// Server objects
const apolloServer = require("./graphql/apolloServer")(dbClient, twilioClient, logger);
const app = express();

// Middleware
apolloServer.applyMiddleware({ app });
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
app.use( (req, res, done) => {
    logger.info('Request URL: ' + req.originalUrl);
    logger.info('Request body: ' + JSON.stringify(req.body));
    done();
});

// Expose frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Handle 404s
app.all("*", (req, res) => {
	return apiResponse.pageNotFound(res);
});

// Listen for requests
app.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}`);
});