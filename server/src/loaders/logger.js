import { createLogger, format, transports } from 'winston';

const Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [new transports.File({ filename: 'covid-status.log' })],
});

/**
 * If we're not in production then **ALSO** log to the `console
 * with the colorized simple format.
 */
if (process.env.NODE_ENV !== 'production') {
  Logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default Logger;
