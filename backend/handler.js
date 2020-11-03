require('dotenv').config();

const PORT = process.env.PORT || 3000;
const logger = require('./utilities/logger');
const dbClient = require('./db/dbClient')(logger);
const twilioClient = require('./twilio/twilioClient')(logger);

const server = require('./graphql/apolloServer')(dbClient, twilioClient, logger);

if (process.env.IS_LAMBDA) {
  exports.graphqlHandler = server.createHandler({
    cors: {
      origin: '*',
      // TODO: This needs changed when we're ready for prod
      // This is facilitating easy testing of deployed lambdas but isn't secure
    },
  });
} else {
  server.listen(PORT).then(({ url }) => {
    logger.info(`🚀 Server ready at ${url}`);
  });
}
