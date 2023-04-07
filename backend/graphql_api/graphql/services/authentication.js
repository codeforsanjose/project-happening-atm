const axios = require("axios");

module.exports = async function loginUser(username, passphrase) {
  console.log("hello joey time to fetch");
  // try {
  //   const result = await axios.get(`https://api.chucknorris.io/jokes/random`);
  //   console.log("lfucasdkf", result);
  // } catch (e) {
  //   console.log("ERRRRO --->", e);
  // }
  try {
    const result = await axios.post("http://localhost:3002/login", {
      username,
      passphrase,
    });
    return result;
  } catch (e) {
    console.log("WWWWAAATATTTTTTT", e);
  }
};
