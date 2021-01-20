require('dotenv').config();

const PORT = process.env.PORT || 3000;
const express = require('express');
const logger = require('./utilities/logger');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  logger.info(`Auth Service running on: http://localhost:${PORT}/`);
});
