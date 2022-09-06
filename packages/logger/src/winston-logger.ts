import { createLogger, format, transports } from 'winston';
const { prettyPrint, timestamp, combine, json } = format;

const logger = createLogger({
  level: 'debug',
  format: json(),
  transports: [
    new transports.File({
      filename: './logs/error.log',
      level: 'error',
      format: combine(
          timestamp({ format: `MM-DD-YYYY [at] HH:mm:ss` }),
          json(),
      ),
    }),
    new transports.Console({
      format: combine(
          timestamp({ format: `MM-DD-YYYY [at] HH:mm:ss` }),
          // timestamp(),
          prettyPrint({ colorize: true }),
      ),
    }),
  ],
});

export default logger;
