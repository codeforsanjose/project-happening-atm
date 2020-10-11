const Twilio = require('twilio');

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = (logger) => {
  const module = {};

  module.sendTextMessage = (recipientPhoneNumber, messageBody) => {
    logger.info(`Sending text message to ${recipientPhoneNumber} with body: ${messageBody}`);
    client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+${recipientPhoneNumber}`,
    }).then((message) => logger.debug(JSON.stringify(message)));
  };

  return module;
};
