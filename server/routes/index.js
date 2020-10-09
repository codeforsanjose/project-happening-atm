const express = require('express');
const apiResponse = require("../utilities/apiResponse");

module.exports = (logger, dbClient) => {
    const authRoutes = require('./authRoutes')(logger, dbClient);
    const frontendRoutes = require('./frontendRoutes')(logger);
    const router = express.Router();
    
    router.use('/', frontendRoutes);
    
    // TODO: It'd be preferable for these routes to have differing prefixes
    // I kept getting a redirect_uri_mismatch error when I changed this prefix to '/auth'
    // I made sure to change the uri in the downstream redirects and the google API console too...
    // Not sure what I was getting wrong but I'll circle back to better distinguish the routes
    router.use('/', authRoutes);
    
    // Handle 404s
    router.route("*").all( (req, res) => {
        return apiResponse.pageNotFound(res);
    });

    return router;
};