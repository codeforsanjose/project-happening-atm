const REQUIRED_FIELD_ERROR = 'This field is required.';
const NO_NUMERIC_PHONE = 'Number not numeric. Please use only digits in your phone number.';
const WRONG_COUNTRY_CODE = 'Country code is required to be 1.';
const UNEXPECTED_PHONE_LENGTH = 'Unexpected length of the phone. Country and area codes are required.';
const BAD_EMAIL = 'We didn\u2019t recognize this email address.';
const NO_AT_IN_EMAIL = 'An email address must contain a single @.';

// Taken from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validatePhone(phone) {
  if (!phone) {
    return REQUIRED_FIELD_ERROR;
  }
  const isPhoneNumeric = /^\d+$/.test(phone);
  if (!isPhoneNumeric) {
    return NO_NUMERIC_PHONE;
  }
  if (!phone.startsWith('1')) {
    return WRONG_COUNTRY_CODE;
  }
  if (phone.length !== 11) {
    return UNEXPECTED_PHONE_LENGTH;
  }
  return null;
}

export function validateEmail(email) {
  if (!email) {
    return REQUIRED_FIELD_ERROR;
  }
  if (email.indexOf('@') === -1) {
    return NO_AT_IN_EMAIL;
  }
  if (!EMAIL_REGEX.test(email.toLowerCase())) {
    return BAD_EMAIL;
  }
  return null;
}
