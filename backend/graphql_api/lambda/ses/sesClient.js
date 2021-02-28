const AWS = require('aws-sdk');

const AWS_SES_API_VERSION = '2019-09-27';

module.exports = (logger) => {
  const module = {};

  const api = new AWS.SESV2({
    apiVersion: AWS_SES_API_VERSION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  });

  const sendEmail = (recipientEmailAddress, body, subject) => {
    subject = subject || body;

    logger.info(`Sending email to ${recipientEmailAddress} with subject: ${subject} body: ${body}`);

    if (process.env.SEND_EMAIL !== 'true') {
      logger.warn('Sending email is disabled. Set SEND_EMAIL=true in .env');
      return;
    }

    const params = {
      Content: {
        Simple: {
          Body: { Text: { Data: body } },
          Subject: { Data: subject },
        },
      },
      Destination: { ToAddresses: [recipientEmailAddress] },
      FromEmailAddress: process.env.FROM_ADDRESS,
    };

    api.sendEmail(params, (err) => {
      if (err) {
        logger.info(`Email failed to send to ${recipientEmailAddress} due to ${err}.`);
      } else {
        logger.info(`Email sent to ${recipientEmailAddress}.`);
      }

      return err;
    });
  };

  module.sendConfirmEmail = (recipientEmailAddress, token) => {
    const subject = 'Please confirm your email address.';

    // TODO: what's the name?
    // TODO: unhardcode domain name
    const body = `Thank you for signing up for gov-agenda-notifier.
Please click the button below to confirm you want to receive email from us.

<a href="https://example/confirm?token=${token}"></a>`;

    sendEmail(recipientEmailAddress, body, subject);
  };

  module.sendEmail = sendEmail;

  return module;
};
