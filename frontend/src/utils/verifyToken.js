import parseJwt from './parseJwt';
import LocalStorageTerms from '../constants/LocalStorageTerms';

// grabs the token from local storage, parses it into json object, then checks that it is valid
const verifyToken = () => {
  // get the authentication token from local storage if it exists
  const token = window.localStorage.getItem(LocalStorageTerms.TOKEN);
  const tokenObj = parseJwt(token);

  // get the seconds since epoch
  const seconds = new Date() / 1000;

  return tokenObj != null && tokenObj.iss === process.env.REACT_APP_JWT_ISSUER
   && tokenObj.exp > seconds;
};

export default verifyToken;
