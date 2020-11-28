require('dotenv').config();

const PORT = process.env.PORT || 3001;
const serverless = require('serverless-http');
const express = require('express');
const upload = require('express-fileupload');
const csvtojson = require('csvtojson');
const logger = require('./utilities/logger');

const app = express();
app.use(upload());

app.post('/upload', async (req, res) => {
  // This is the expected value of the name attribute in the upload request
  const expectedNameAttribute = 'csvfile';

  if (expectedNameAttribute in req.files) {
    const csvData = req.files[expectedNameAttribute].data.toString('utf8');
    const jsonValue = await csvtojson().fromString(csvData);
    res.status(201).json({ csv: csvData, jsonValue });
  } else {
    const message = '400 Bad Request: unrecongized name attribute';
    logger.info(message);
    res.status(400).json({ message });
  }
});

if (process.env.IS_LAMBDA) {
  logger.info('Exporting lambda handler');
  exports.uploadHandler = serverless(app);
} else {
  app.listen(PORT, () => {
    logger.info(`Agenda Upload Service running on: http://localhost:${PORT}/`);
  });
}
