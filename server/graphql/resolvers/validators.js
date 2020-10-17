const { UserInputError, ForbiddenError } = require('apollo-server-express');

// TODO: We might want to have these set up in a config file for easy modification
const possibleStatuses = ['PENDING', 'IN PROGRESS', 'COMPLETED'];
const possibleTypes = ['test'];

module.exports = (logger) => {
  const module = {};

  module.validateAuthorization = (isAdmin, context) => {
    if (!isAdmin) {
      logger.debug(`${context}: Attempted without admin credentials`);
      throw new ForbiddenError('No admin credentials provisioned. Log in.');
    }
  };

  const throwUserInputError = (errorMsg, context) => {
    logger.debug(`UserInputError - ${context}: ${errorMsg}`);
    throw new UserInputError(errorMsg);
  };

  const validateTimestamp = (ts, fieldName, context) => {
    const tsIsNumeric = /^\d+$/.test(ts);
    if (!tsIsNumeric) {
      const msg = `Invalid "${fieldName}" field. Timestamp is not numeric.`;
      logger.debug(`Timestamp: ${ts}`);
      throwUserInputError(msg, context);
    }
    const isValidDate = new Date(parseInt(ts, 10)).getTime() > 0;
    if (!isValidDate) {
      const msg = `Invalid "${fieldName}" field. Timestamp is not a valid date.`;
      logger.debug(`Timestamp: ${ts}`);
      throwUserInputError(msg, context);
    }
  };

  const validateFutureTimestamp = (ts, fieldName, context) => {
    validateTimestamp(ts, fieldName, context);

    const now = new Date();
    const isFutureDate = ts >= now;
    if (!isFutureDate) {
      const msg = `Invalid "${fieldName}" field. Timestamp doesn't reference a future date.`;
      logger.debug(`Timestamp: ${ts}`);
      throwUserInputError(msg, context);
    }
  };

  const validateURL = (url, fieldName, context) => {
    // Stolen from: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
      + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
      + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
      + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
      + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    const isvalidURL = pattern.test(url);

    if (!isvalidURL) {
      const msg = `Invalid "${fieldName}" field. Bad URL.`;
      logger.debug(`URL: ${url}`);
      throwUserInputError(msg, context);
    }
  };

  module.validateCreateMeeting = (args) => {
    const context = 'validateCreateMeeting';

    const meetingStartTimestamp = args.meeting_start_timestamp;
    const virtualMeetingURL = args.virtual_meeting_url;
    const meetingType = args.meeting_type;
    const { status } = args;

    validateFutureTimestamp(meetingStartTimestamp, 'meeting_start_timestamp', context);
    validateURL(virtualMeetingURL, 'virtual_meeting_url', context);

    // Meeting type should be included in the list of allowed types
    if (!possibleTypes.includes(meetingType)) {
      const msg = 'Invalid "type" field';
      logger.debug(`Type input: ${meetingType}`);
      throwUserInputError(msg, context);
    }

    // The status should be included in the list of allowed statuses
    if (!possibleStatuses.includes(status)) {
      const msg = 'Invalid "status" field';
      throwUserInputError(msg, context);
    }
  };

  return module;
};
