const axios = require("axios");

module.exports = async function loginUser(username, passphrase) {
  console.log("hello joey time to fetch");

  try {
    const result = await axios.post("http://backend:3002/login", {
      username,
      passphrase,
    });
    return result;
  } catch (e) {
    console.log("WWWWAAATATTTTTTT", e);
  }
};
