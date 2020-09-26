const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = (logger) => {
    var module = {}
    
    module.sendTextMessage = (recipient_phone_number, message_body) => {
        logger.info('Sending text message to ' + recipient_phone_number + ' with body: ' + message_body)
        client.messages.create({
            body: message_body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: '+' + recipient_phone_number
        }).then(message => logger.debug(JSON.stringify(message)));
    };

    return module
}