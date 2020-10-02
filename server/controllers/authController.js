const express = require('express');
const passport = require('passport');
const authMiddleware = require("../auth/authMiddleware");

module.exports = (logger) => {
    let module = {};
    module.logginFailed = (req, res) => {
        res.send('You Failed to log in!');
    };

    module.logginSuccess = (req, res) => {
        res.send(`Welcome ${req.user.displayName}!`);
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