// takes a jwt and parses it into a json object

// this will decode a token into a usable json object, allows the access of the json properties
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export default parseJwt;
