const express = require('express');
const passport = require('passport');
const authMiddleware = require("../auth/authMiddleware");

module.exports = (logger, dbClient) => {
    let module = {};
    module.logginFailed = (req, res) => {
        res.send('You Failed to log in!');
    };

    module.logginSuccess = async (req, res) => {
        let userEmail = req.user._json.email;
        let userName = req.user.displayName;
        logger.info('User logged in: ' + userEmail + ' : ' + userName);

        // Verify admin rights
        let dbResponse = await dbClient.getAdminByEmail(userEmail);
        req.ADMIN = dbResponse.rows.length > 0;
        logger.info('Admin: ' + req.ADMIN);

        res.send(`Welcome ${userName}! Administrator: ${req.ADMIN}`);
    };

    module.googleCallback = (req, res) => {
        res.redirect('/good');
    };
    
    module.logout = (req, res) => {
        req.session = null;
        req.logout();
        res.redirect('/');
    };
    
    return module;
}