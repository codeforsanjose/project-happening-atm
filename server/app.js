require('dotenv').config();
require('./auth/passportSetup');
const path = require("path");
const express = require("express");
const passport = require('passport');
const cookieSession = require('cookie-session');
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
apolloServer.applyMiddleware({ app });
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
app.use( (req, res, done) => {
    logger.info('Request URL: ' + req.originalUrl);
    logger.info('Request body: ' + JSON.stringify(req.body));
    done();
});

// Initialize passport and passport sessions for auth
app.use(cookieSession({
    name: 'gov-agenda-notifier',
    secret: process.env.COOKIE_SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());

// Expose our routes
app.use(routes);

// Listen for requests
app.listen(PORT, () => logger.info(`App listening on port ${PORT}`));