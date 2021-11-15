import parseJwt from './parseJwt';
import LocalStorageTerms from '../constants/LocalStorageTerms';

// grabs the token from local storage, parses it into json object, then checks that it is valid
const verifyToken = () => {
  // get the authentication token from local storage if it exists
  const token = window.localStorage.getItem(LocalStorageTerms.TOKEN);
  const tokenObj = parseJwt(token);

  // console.log(token.iss);
  // Don't bother verifying a google or microsoft token, just return true
  if (tokenObj !== null && (tokenObj.iss === 'accounts.google.com' || tokenObj.iss === 'https://login.microsoftonline.com/49669b17-fa33-4ae3-8ecc-3cf116b790e5/v2.0')) {
    return true;
  }

  // verify our tokens
  // get the seconds since epoch
  const seconds = new Date() / 1000;

  return tokenObj != null && tokenObj.iss === process.env.REACT_APP_JWT_ISSUER &&
    tokenObj.exp > seconds;
};

export default verifyToken;

export function getUserEmail() {
  const token = window.localStorage.getItem(LocalStorageTerms.TOKEN);
  return parseJwt(token).email;
}
/**
 * Parallel function to getUserEmail, to be used by subscription flow.
 * Dependent on WIP effort for account creation functionality:
 * Currently, user account records only include email, but pending updates
 * for account creation functionality will add phone
 */

export function getUserPhone() {
  const token = window.localStorage.getItem(LocalStorageTerms.TOKEN);
  const phone = parseJwt(token).phone;
  if (phone) {
    return phone;
  } else return '';
}