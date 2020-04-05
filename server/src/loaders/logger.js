import winston from 'winston';
import config from '../config';

/**
 * If we're in production then log to file and in development
 * log to the console with the colorized simple format.
 */
const transports = [];
if (process.env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.File({ filename: 'covid-status.log' }));
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}
const Logger = winston.createLogger({
  level: config.loglevel,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'MM-DD-YYYY HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports,
});

export default Logger;
