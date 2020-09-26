require('dotenv').config();
const express = require("express");
const apiResponse = require("./utilities/apiResponse");
const graphqlMiddleware = require("./graphql/graphql");
const PORT = process.env.PORT || 3000;

const logger = require("./utilities/logger");
const twilioClient = require("./twilio/twilioClient")(logger);
const dbClient = require("./db/dbClient")(logger);

const app = express();

app.use(express.json());

app.use( (req, res, done) => {
    logger.info('Request URL: ' + req.originalUrl);
    logger.info('Request body: ' + JSON.stringify(req.body));
    done();
});

app.use('/graphql/', graphqlMiddleware(dbClient, twilioClient, logger));

app.all("*", (req, res) => {
	return apiResponse.pageNotFound(res);
});

app.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}`);
});