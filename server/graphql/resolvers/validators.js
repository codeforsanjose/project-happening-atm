const { UserInputError, ForbiddenError } = require('apollo-server-express');

module.exports = (logger) => {
  const module = {};

  // TODO: We might want to have these set up in a config file for easy modification
  const possibleStatuses = ['PENDING', 'IN PROGRESS', 'COMPLETED'];

  module.validateAuthorization = (isAdmin, loggerMsgPrefix) => {
    if (!isAdmin) {
      logger.debug(`${loggerMsgPrefix}: Attempted without admin credentials`);
      throw new ForbiddenError('No admin credentials found. Log back into an admin account.');
    }
  };

  const throwUserInputError = (loggerMsgPrefix, errorMsg) => {
    logger.debug(loggerMsgPrefix + errorMsg);
    throw new UserInputError(errorMsg);
  };

  module.validateCreateMeeting = (meetingType,
    meetingStartTimestamp, virtualMeetingUrl, status) => {
    const loggerMsgPrefix = 'UserInputError: validateCreateMeeting - ';

    // The timestamp needs to be a future date
    const now = new Date();
    const TSIsNumeric = /^\d+$/.test(meetingStartTimestamp);
    const isValidDate = new Date(parseInt(meetingStartTimestamp, 10)).getTime() > 0;
    const isFutureDate = meetingStartTimestamp >= now;
    const validTS = isValidDate && isFutureDate && TSIsNumeric;
    if (!validTS) {
      const msg = 'Invalid "meetingStartTimestamp" field';
      logger.debug(`TS: ${meetingStartTimestamp}`);
      logger.debug(`Numeric: ${TSIsNumeric}`);
      logger.debug(`isValidDate: ${isValidDate}`);
      logger.debug(`isFutureDate: ${isFutureDate}`);
      throwUserInputError(loggerMsgPrefix, msg);
    }

    // The status should be included in the list of allowed statuses
    if (!possibleStatuses.includes(status)) {
      const msg = 'Invalid "status" field';
      throwUserInputError(loggerMsgPrefix, msg);
    }
  };

  return module;
};
