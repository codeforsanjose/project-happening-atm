// TODO: Replace with AWS SNS for text messages

// const Twilio = require('twilio');

// const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// module.exports = (logger) => {
//   const module = {};

//   module.sendTextMessage = (recipientPhoneNumber, messageBody) => {
//     messageBody += ` To opt out, reply 'STOP' anytime.`
//     logger.info(`Sending text message to ${recipientPhoneNumber} with body: ${messageBody}`);

//     if (process.env.SEND_TEXT != 'true') {
//       logger.warn(`Sending text is disabled. Set SEND_TEXT=true in .env.`)
//       return
//     }

//     // If you send multiple messages at once from a single Twilio sender
//     // (number or Alphanumeric Sender ID), Twilio will queue them up for
//     // delivery. Your messages may experience differing rate limits based on
//     // the sender you are using. For messages from a US or Canada long code
//     // number, the limit is one message segment per second (MPS).
//     // https://www.twilio.com/docs/sms/send-messages#a-note-on-rate-limiting
//     client.messages.create({
//       body: messageBody,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: `+${recipientPhoneNumber}`,
//     }, function(err, _) {
//       if (err) {
//         logger.info(`Text failed to sent from ${process.env.TWILIO_PHONE_NUMBER} to ${recipientPhoneNumber} due to ${err}.`)
//       } else {
//         logger.info(`Text sent from ${process.env.TWILIO_PHONE_NUMBER} to ${recipientPhoneNumber}.`)
//       }
//     });
//   };

//   return module;
// };
