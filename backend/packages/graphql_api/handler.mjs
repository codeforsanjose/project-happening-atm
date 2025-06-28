import { config } from 'dotenv';
import { startStandaloneServer } from '@apollo/server/standalone';
import logger from './utilities/logger.js';
import createApolloServer from './graphql/apolloServer.js';

config();

const PORT = process.env.PORT || 3000;
const server = createApolloServer(logger);

startStandaloneServer(server, {
  listen: { port: PORT },
  context: ({ req }) => {
    if (req.headers.authorization) {
      const context = authentication.getToken(req.headers.authorization);
      return context;
    }
    // if no token in headers setting token to null
    return {
      token: null,
    };
  },
}).then(({ url }) => {
  logger.info(`🚀 Server ready for local dev at: ${url}`);
});
