const csvtojson = require('csvtojson');

module.exports = (logger) => {
  const module = {};

  module.csvUpload = async (req, res) => {
    logger.info('CSV Upload Controller');
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
  };

  return module;
};
