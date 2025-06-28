const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://backend:3002';
async function postRequest(url, body, _headers = {}) {
  const fullURL = `${BASE_URL}${url}`;
  return axios.post(fullURL, body);
}

module.exports = {
  postRequest,
};
