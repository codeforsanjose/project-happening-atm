const axios = require("axios");

module.exports = async function loginUser(username, passphrase) {
  try {
    const result = await axios.post("http://backend:3002/auth/login", {
      username,
      passphrase,
    });
    return result;
  } catch (e) {
    console.log("error in login", e.response.status);
  }
};
