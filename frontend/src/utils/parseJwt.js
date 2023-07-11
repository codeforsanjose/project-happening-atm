// takes a jwt and parses it into a json object

// this will decode a token into a usable json object, allows the access of the json properties
const parseJwt = (token) => {
  try {
    const partToRead = token;
    
    const parsed = JSON.parse(Buffer.from(partToRead.split('.')[1], 'base64').toString('utf8'));

    return parsed;
  } catch (e) {
    console.log("the error", e);
    return null;
  }
};

export default parseJwt;
