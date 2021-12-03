export const validEmail = (value) => {
  // Taken from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  const regex = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  return regex.test(value);
};

export const isNumericString = (string) => /^\d+$/.test(string);

export const isNullOrEmpty = (value) => (!!(value === null || value.length === 0));

export const validUSPhoneNumber = (value) => {
  if (value) {
    if (!isNumericString(value) || value.charAt(0) !== 1 || value.length !== 11) {
      return false;
    }
    return true;
  }
};

export const isPasswordValid = (str) => {
  if (str.match(/[a-z]/g) && str.match(
    /[A-Z]/g,
  ) && str.match(
    /[0-9]/g,
  ) && str.match(
    /[^a-zA-Z\d]/g,
  ) && str.length >= 6) return true;
  return false;
};
