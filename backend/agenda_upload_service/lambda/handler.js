require('dotenv').config();
const serverless = require('serverless-http');

const PORT = process.env.PORT || 3001;
const logger = require('./utilities/logger');
const app = require('./app')(logger);

if (process.env.IS_LAMBDA) {
  logger.info('Exporting lambda handler');
  exports.uploadHandler = serverless(app);
} else {
  app.listen(PORT, () => {
    logger.info(`Agenda Upload Service running on: http://localhost:${PORT}/`);
  });
}
