require('dotenv').config();

const PORT = process.env.PORT || 3000;
const logger = require('./utilities/logger');
const server = require('./graphql/apolloServer')(logger);

if (process.env.IS_LAMBDA) {
  logger.info('Exporting lambda handler');
  exports.graphqlHandler = server.createHandler({
    cors: {
      origin: '*',
      // TODO: This needs changed when we're ready for prod
      // This is facilitating easy testing of deployed lambdas but isn't secure
    },
  });
} else {
  server.listen(PORT).then(({ url }) => {
    logger.info(`🚀 Server ready for local dev at: ${url}`);
  });
}
