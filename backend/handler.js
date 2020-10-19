const isLambda = process.env.IS_LAMBDA;

const logger = require('./utilities/logger');
const dbClient = require('./db/dbClient')(logger);
const twilioClient = require('./twilio/twilioClient')(logger);

const server = require('./graphql/apolloServer')(dbClient, twilioClient, logger);

if (isLambda) {
  exports.graphqlHandler = server.createHandler({
    cors: {
      origin: '*',
    },
  });
} else {
  server.listen().then(({ url }) => {
    logger.info(`🚀 Server ready at ${url}`);
  });
}
