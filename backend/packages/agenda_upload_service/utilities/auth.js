const config = require("./config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
//Use the ApiKey and APISecret from config.js
const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, config.JWTSecret);

function addToken(req, res, next) {
  req.body["token"] = token;
  next();
}
const comparePassword = async (password, hash) => {
  const passwordMatch = await bcrypt.compare(password, hash);
  return passwordMatch;
};

module.exports = { addToken, comparePassword };
