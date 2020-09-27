require('dotenv').config();
const path = require("path");
const express = require("express");
const apiResponse = require("./utilities/apiResponse");
const graphqlMiddleware = require("./graphql/graphql");
const PORT = process.env.PORT || 3000;

const logger = require("./utilities/logger");
const twilioClient = require("./twilio/twilioClient")(logger);
const dbClient = require("./db/dbClient")(logger);

const app = express();

app.use(express.static(path.join(__dirname, "..", "client/build")));
app.use(express.static("client/public"));
app.use(express.json());

app.use( (req, res, done) => {
    logger.info('Request URL: ' + req.originalUrl);
    logger.info('Request body: ' + JSON.stringify(req.body));
    done();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.use('/graphql/', graphqlMiddleware(dbClient, twilioClient, logger));

app.all("*", (req, res) => {
	return apiResponse.pageNotFound(res);
});

app.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}`);
});