/* eslint-disable camelcase */
// I'm disabling this error because we're using variable names from the schema
// that use snake_case since they're referencing values in our DB that also uses snake_case

const { UserInputError, ForbiddenError } = require('apollo-server');

// TODO: We might want to have these set up in a config file for easy modification
const possibleStatuses = ['PENDING', 'IN PROGRESS', 'COMPLETED', 'DEFERRED', 'ON HOLD', 'CANCELLED', 'ENDED', 'NOT STARTED'];
const possibleTypes = ['test'];
const possibleContentCategories = ['test', 'gov', 'tech', 'lol'];

module.exports = (logger) => {
  // --- Reusable functionality that's found in multiple validators is here at the top ---

  const throwUserInputError = (errorMsg, context) => {
    logger.debug(`UserInputError - ${context}: ${errorMsg}`);
    throw new UserInputError(errorMsg);
  };

  const validateStatus = (status, fieldName, context) => {
    // The status should be included in the list of allowed statuses
    if (!possibleStatuses.includes(status)) {
      const msg = `Invalid "${fieldName}" field input value: ${status}`;
      throwUserInputError(msg, context);
    }
  };

  const validateType = (type, fieldName, context) => {
    // Meeting type should be included in the list of allowed types
    if (!possibleTypes.includes(type)) {
      const msg = `Invalid "${fieldName}" field input value: ${type}`;
      throwUserInputError(msg, context);
    }
  };

  const validateContentCategories = (contentCategories, fieldName, context) => {
    // TODO: This validation logic is likely to change as it's
    // currently dependent on the client sending a string.
    // That's a little gross. Why not an array?
    const categoryArray = contentCategories.split(',');
    categoryArray.forEach((category) => {
      if (!possibleContentCategories.includes(category)) {
        const msg = `Invalid "${fieldName}" field input value: ${category}`;
        throwUserInputError(msg, context);
      }
    });
  };

  // Taken from: https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
  // Returns a boolean representing whether the string is a numeric whole number
  const isNumericString = (string) => /^\d+$/.test(string);

  const validateTimestamp = (ts, fieldName, context) => {
    if(ts != '0'){
      const tsIsNumeric = isNumericString(ts);
      if (!tsIsNumeric) {
        const msg = `Invalid "${fieldName}" field. Timestamp is not numeric: ${ts}`;
        throwUserInputError(msg, context);
      }
      const isValidDate = new Date(parseInt(ts, 10)).getTime() > 0;
      if (!isValidDate) {
        const msg = `Invalid "${fieldName}" field. Timestamp is not a valid date: ${ts}`;
        throwUserInputError(msg, context);
      }
    }
  };

  const validateFutureTimestamp = (ts, fieldName, context) => {
    validateTimestamp(ts, fieldName, context);

    const now = new Date();
    const isFutureDate = ts >= now;
    if (!isFutureDate) {
      const msg = `Invalid "${fieldName}" field. Timestamp doesn't reference a future date: ${ts}`;
      throwUserInputError(msg, context);
    }
  };

  const validateURL = (url, fieldName, context) => {
    // Taken from: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
      + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
      + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
      + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
      + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    const isvalidURL = pattern.test(url);

    if (!isvalidURL) {
      const msg = `Invalid "${fieldName}" field. Bad URL: ${url}`;
      throwUserInputError(msg, context);
    }
  };

  const isValidEmailString = (email) => {
    // Taken from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validateEmail = (email, fieldName, context) => {
    if (!isValidEmailString(email)) {
      const msg = `Invalid "${fieldName}" field value. Bad email: ${email}`;
      throwUserInputError(msg, context);
    }
  };

  const validateTwilioSafePhoneNumber = (phoneNumber, fieldName, context) => {
    if (!isNumericString(phoneNumber)) {
      const msg = `Invalid "${fieldName}" field value. Number not numeric: ${phoneNumber}`;
      throwUserInputError(msg, context);
    } else if (!(phoneNumber.charAt(0) === '1')) {
      const msg = `Invalid "${fieldName}" field value. Country code is required to be 1: ${phoneNumber}`;
      throwUserInputError(msg, context);
    } else if (phoneNumber.length !== 11) {
      const msg = `Invalid "${fieldName}" field value. Unexpected length. Country and area codes are required: ${phoneNumber}`;
      throwUserInputError(msg, context);
    }
  };

  // --- Here's the exported validation functionality: ---

  const module = {};

  module.validateAuthorization = (context) => {
    const isAdmin = context.user.roles.includes('ADMIN');

    if (!isAdmin) {
      logger.debug(`${context.user.first_name} ${context.user.last_name} with ${context.user.email}: Attempted without admin credentials`);
      throw new ForbiddenError('No admin credentials provided.');
    }
  };

  // (10.12.2021) JYip:added 'ADMIN' in order to support subscriptions for admin users as well
  module.validateUser = (context) => {
    const roles = ['USER', 'ADMIN'];
    const isUser = context.user.roles.some((role) => roles.includes(role));
    if (!isUser) {
      logger.debug(`${context.user.first_name} ${context.user.last_name} with ${context.user.email}: Attempted without user credentials`);
      throw new ForbiddenError('No user credentials provided. Please log in.');
    }
  };

  module.validateAuthType = (authType, loginMethod) => {
    const isMatch = authType === loginMethod;
    if (!isMatch) {
      logger.debug(`Incorrect login type: User auth type is ${authType} and tried to login with ${loginMethod} type.`);
      throw new ForbiddenError('Incorrect authentication type');
    }
  };

  module.validateCreateMeeting = (args) => {
    const context = 'validateCreateMeeting';
    const {
      status, meeting_start_timestamp, virtual_meeting_url, meeting_type,
    } = args;

    validateFutureTimestamp(meeting_start_timestamp, 'meeting_start_timestamp', context);
  };

  module.validateUpdateMeeting = (args) => {
    const context = 'validateUpdateMeeting';
    const {
      status, meeting_start_timestamp, meeting_end_timestamp, virtual_meeting_url, meeting_type,
    } = args;

    // No need to validate ID here because the graphQL schema takes care of it well enough

    if (meeting_start_timestamp) validateTimestamp(meeting_start_timestamp, 'meeting_start_timestamp', context);
    if (meeting_end_timestamp) validateTimestamp(meeting_end_timestamp, 'meeting_end_timestamp', context);
    if (virtual_meeting_url) validateURL(virtual_meeting_url, 'virtual_meeting_url', context);
    if (meeting_type) validateType(meeting_type, 'meeting_type', context);
    if (status) validateStatus(status, 'status', context);
  };

  module.validateCreateMeetingItem = (args) => {
    const context = 'createMeetingItem';

    // No need to validate meeting_id, order_number. The schema's validation is good enough

    // TODO: description_loc_key and title_loc_key aren't yet references
    // to anything - additional validation is not required for them yet

    const {
      item_start_timestamp, item_end_timestamp, status, content_categories,
      // description_loc_key, title_loc_key,
    } = args;

    validateFutureTimestamp(item_start_timestamp, 'item_start_timestamp', context);
    validateFutureTimestamp(item_end_timestamp, 'item_end_timestamp', context);
    validateContentCategories(content_categories, 'content_categories', context);
    validateStatus(status, 'status', context);
  };

  module.validateUpdateMeetingItem = (args) => {
    const context = 'updateMeetingItem';

    // No need to validate meeting_id, order_number. The schema's validation is good enough

    // TODO: description_loc_key and title_loc_key aren't yet references
    // to anything - additional validation is not required for them yet

    const {
      item_start_timestamp, item_end_timestamp, status, content_categories,
      // description_loc_key, title_loc_key,
    } = args;

    validateTimestamp(item_start_timestamp, 'item_start_timestamp', context);
    validateTimestamp(item_end_timestamp, 'item_end_timestamp', context);
    validateContentCategories(content_categories, 'content_categories', context);
    validateStatus(status, 'status', context);
  };

  module.validateCreateSubscriptions = (args) => {
    const context = 'createSubscriptions';

    const {
      phone_number, email_address,
    } = args;

    // Check that at least one method is specified.
    if (phone_number === '' && email_address === '') {
      const msg = 'Either phone number or email address is required.';
      throwUserInputError(msg, context);
    }
    if (phone_number !== '') {
      validateTwilioSafePhoneNumber(phone_number, 'phone_number', context);
    }
    if (email_address !== '') {
      validateEmail(email_address, 'email_address', context);
    }
  };

  module.validateCreateAccount = (args) => {
    const context = 'createAccount';
    const { email_address, phone_number } = args;

    validateEmail(email_address, 'email_address', context);
    if (phone_number && phone_number.length > 0) validateTwilioSafePhoneNumber(phone_number, 'phone_number', context);
  };

  module.validateUpdateEmail = (args) => {
    const context = 'updateEmail'
    const { email_address } = args;

    validateEmail(email_address, 'email_address', context);
  }

  module.validateUpdatePhoneNumber = (args) => {
    const context = 'updatePhoneNumber'
    const { phone_number } = args;

    if (phone_number && phone_number.length > 0) validateTwilioSafePhoneNumber(phone_number, 'phone_number', context);
  }

  return module;
};
