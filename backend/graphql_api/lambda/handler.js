require('dotenv').config();

const PORT = process.env.PORT || 3000;
const logger = require('./utilities/logger');
const server = require('./graphql/apolloServer')(logger);

server.listen(PORT).then(({ url }) => {
  logger.info(`🚀 Server ready for local dev at: ${url}`);
});
