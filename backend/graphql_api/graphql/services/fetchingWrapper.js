const axios = require("axios");

async function postRequest(url, body, headers) {
  return await axios.post(url, body);
}

module.exports = {
  postRequest,
};
