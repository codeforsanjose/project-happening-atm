const env = process.env.NODE_ENV || "development";

/**
 * insert your API Key & Secret for each environment
 * keep this file local and never push it to a public repo for security purposes.
 */
const config = {
  development: {
    APIKey: process.env.ZOOM_API_KEY,
    APISecret: process.env.ZOOM_API_SECRET,
    JWTSecret: "mysupersecret",
  },
  production: {
    APIKey: process.env.ZOOM_API_KEY,
    APISecret: process.env.ZOOM_API_SECRET,
    JWTSecret: "mysupersecret",
  },
};

module.exports = config[env];
