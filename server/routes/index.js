const express = require('express');
const authRoutes = require('./auth')
const frontendRoutes = require('./frontend')
const router = express.Router();

router.use('/', authRoutes);
router.use('/', frontendRoutes)

module.exports = router;