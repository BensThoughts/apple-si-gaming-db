/* eslint-disable no-var */
import { createLogger, format, transports as winstonTransports } from 'winston';
import type { LoggerOptions } from 'winston';
import {
  NODE_ENV,
  LOGGER_LOG_LEVEL,
  LOGGER_SERVICE_LABEL,
  LOGTAIL_SOURCE_TOKEN,
} from './config';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import type { ExtendedLeveledLogMethod, LoggerMetadata } from './types';
const {
  prettyPrint,
  timestamp,
  combine,
  json,
  errors,
  label,
} = format;

function getLogger() {
  const transports: LoggerOptions['transports'] = [
    new winstonTransports.File({
      filename: './logs/error.log',
      level: 'error',
    }),
    new winstonTransports.Console(),
  ];

  if (LOGTAIL_SOURCE_TOKEN) {
    const logtail = new Logtail(LOGTAIL_SOURCE_TOKEN);
    transports.push(new LogtailTransport(logtail));
  }

  const logger = createLogger({
    level: LOGGER_LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp(),
        label({ label: LOGGER_SERVICE_LABEL, message: false }),
        // timestamp({ format: `MM-DD-YYYY [at] hh:mm:ss A` }),
        // timestamp({ format: `MM-DD-YYYY [at] HH:mm:ss` }),
        NODE_ENV === 'development' &&
        !LOGTAIL_SOURCE_TOKEN
          ? prettyPrint({ colorize: true })
          : json(),
    ),
    transports,
  });

  const error: ExtendedLeveledLogMethod = (
      message: string | object | any,
      metadata?: LoggerMetadata & { error?: Error },
  ) => {
    if (typeof message === 'string') {
      return logger.error(message, metadata);
    }
    return logger.error(message);
  };

  const warn: ExtendedLeveledLogMethod = (
      message: string | object | any,
      metadata?: LoggerMetadata & { error?: Error },
  ) => {
    if (typeof message === 'string') {
      return logger.warn(message, metadata);
    }
    return logger.warn(message);
  };

  const info: ExtendedLeveledLogMethod = (
      message: string | object | any,
      metadata?: LoggerMetadata & { error?: Error },
  ) => {
    if (typeof message === 'string') {
      return logger.info(message, metadata);
    }
    return logger.info(message);
  };

  const http: ExtendedLeveledLogMethod = (
      message: string | object | any,
      metadata?: LoggerMetadata & { error?: Error },
  ) => {
    if (typeof message === 'string') {
      return logger.http(message, metadata);
    }
    return logger.http(message);
  };

  const debug: ExtendedLeveledLogMethod = (
      message: string | object | any,
      metadata?: LoggerMetadata & { error?: Error },
  ) => {
    if (typeof message === 'string') {
      return logger.debug(message, metadata);
    }
    return logger.debug(message);
  };

  // TODO: get rid of ignore comments and fix call signature
  // TODO: typescript complains generically with...
  // TODO: Type '(message: any, meta: any) => winston.Logger'
  // TODO: is not assignable to type 'ExtendedLeveledLogMethod'.ts(2322)
  // @ts-ignore
  // const warn: ExtendedLeveledLogMethod = (message: any, meta: any) => logger.warn(message, meta);
  // @ts-ignore
  // const info: ExtendedLeveledLogMethod = (message: any, meta: any) => logger.info(message, meta);
  // @ts-ignore
  // const http: ExtendedLeveledLogMethod = (message: any, meta: any) => logger.http(message, meta);
  // @ts-ignore
  // const debug: ExtendedLeveledLogMethod = (message: any, meta: any) => logger.debug(message, meta);

  return {
    error,
    warn,
    info,
    http,
    debug,
  };
};


const logger = getLogger();
export { logger };

