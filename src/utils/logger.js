import winston from 'winston';
import { config } from '../config/settings.js';

const SPLAT = Symbol.for('splat')

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'HH:mm:ss'
    }),
    winston.format.printf(({ timestamp, level, message, [SPLAT]:splat}) => {
      let msg = `${timestamp} ${level}: ${message}`;
      if(splat){
         msg += ' ' + JSON.stringify(splat);
      }
      return msg;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Log the current level when logger is initialized
logger.info(`Logger initialized with level: ${logger.level}`);

export { logger };