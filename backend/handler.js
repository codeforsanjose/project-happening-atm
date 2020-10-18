require('dotenv').config();
const express = require('express');

const logger = require('./utilities/logger');
const dbClient = require('./db/dbClient')(logger);
const twilioClient = require('./twilio/twilioClient')(logger);

const server = require('./graphql/apolloServer')(dbClient, twilioClient, logger);

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
  },
});