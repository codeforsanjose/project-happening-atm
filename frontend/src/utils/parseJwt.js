// takes a jwt and parses it into a json object

// this will decode a token into a usable json object, allows the access of the json properties
const parseJwt = (token) => {
  try {
    const partToRead = token;
    // TODO: currently this function was useing atob which is depricated
    // once it parses it trys to use the roles but it is a random generated token line 384 in mutation.js in backend graphql
    // that would need to be parsed to base64 encoding there and here would read to utf8 and use the roles
    const parsed = JSON.parse(Buffer.from(partToRead, "utf8"));
    return parsed;
  } catch (e) {
    console.log("the error", e);
    return null;
  }
};

export default parseJwt;
