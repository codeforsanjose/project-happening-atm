require('dotenv').config();
require('./auth/passportSetup');
const path = require("path");
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;

// Dependencies
const logger = require("./utilities/logger");
const dbClient = require("./db/dbClient")(logger);
const routes = require("./routes/index")(logger, dbClient);
const twilioClient = require("./twilio/twilioClient")(logger);

// Server objects
const apolloServer = require("./graphql/apolloServer")(dbClient, twilioClient, logger);
const app = express();

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public")); // TODO: Is this needed???
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use( (req, res, done) => {
    logger.info('Request URL: ' + req.originalUrl);
    logger.info('Request body: ' + JSON.stringify(req.body));
    done();
});
apolloServer.applyMiddleware({ app });

// Expose our routes
app.use(routes);

// Listen for requests
app.listen(PORT, () => logger.info(`App listening on port ${PORT}`));