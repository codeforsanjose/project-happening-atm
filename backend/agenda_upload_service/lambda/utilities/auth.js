const config = require("./config");
const jwt = require("jsonwebtoken");

//Use the ApiKey and APISecret from config.js
const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);

function addToken(req, res, next) {
    req.body["token"] = token;
    next();
}

module.exports = { addToken }