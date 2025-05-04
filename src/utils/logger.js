const winston = require('winston');
const config = require('../config/settings');

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'HH:mm:ss'
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Log the current level when logger is initialized
logger.info(`Logger initialized with level: ${logger.level}`);

module.exports = logger;