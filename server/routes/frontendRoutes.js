const path = require('path');
const express = require('express');

module.exports = (logger) => {
  const router = express.Router({ mergeParams: true });

  router.route('/').get((req, res) => {
    logger.info('Sending index.html');
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });

  return router;
};
