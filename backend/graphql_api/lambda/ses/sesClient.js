const AWS = require('aws-sdk');
const AWS_SES_API_VERSION = '2019-09-27';

module.exports = (logger) => {
  const module = {};

  module.api = new AWS.SESV2({
    apiVersion: AWS_SES_API_VERSION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  });

  module.sendEmail = (recipientEmailAddress, messageBody) => {
    logger.info(
      `Sending email to ${recipientEmailAddress} with subject: ${messageSubject} body: ${messageBody}`
    );

    if (process.env.SEND_EMAIL != 'true') {
      logger.warn(`Sending email is disabled. Set SEND_EMAIL=true in .env.`)
      return
    }

    let params = {
      Content: {
        Simple: {
          Body: { Text: { Data: messageSubject } },
          Subject: { Data: messageSubject },
        },
      },
      Destination: { ToAddresses: [recipientEmailAddress] },
      FromEmailAddress: process.env.FROM_ADDRESS,
    };

    module.api.sendEmail(params, function (err, _) {
      if (err) {
        logger.info(`Email failed to send to ${recipientEmailAddress} due to ${err}.`);
      } else {
        logger.info(`Email sent to ${recipientEmailAddress}.`);
      }
    });
  };

  return module;
};
