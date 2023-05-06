const { postRequst } = require("./fetchingWrapper");
module.exports = async function loginUser(username, passphrase) {
  try {
    const body = {
      username,
      password: passphrase,
    };
    const result = await postRequst("/auth/login", body);
    return result.data.user;
  } catch (e) {
    console.log("error in login", e.response.status);
  }
};