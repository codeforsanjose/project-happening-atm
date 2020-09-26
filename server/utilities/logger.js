const winston = require('winston');

const myformat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: myformat,
        level: 'debug',
        handleExceptions: true,
        json: true,
        colorize: true,
      })
    ],
    exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;