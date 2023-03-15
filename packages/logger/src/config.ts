import invariant from 'tiny-invariant';

const getConfig = () => {
  const LOGGER_SERVICE_LABEL = process.env.LOGGER_SERVICE_LABEL;
  invariant(typeof LOGGER_SERVICE_LABEL === 'string', 'LOGGER_SERVICE_LABEL env var for packages/logger not set');
  const LOGGER_LOGTAIL_SOURCE_TOKEN = process.env.LOGGER_LOGTAIL_SOURCE_TOKEN;
  const NODE_ENV = process.env.NODE_ENV;
  const LOGGER_LOG_LEVEL = process.env.LOGGER_LOG_LEVEL || 'info';
  return {
    NODE_ENV,
    LOGGER_LOG_LEVEL,
    LOGGER_SERVICE_LABEL,
    LOGGER_LOGTAIL_SOURCE_TOKEN,
  };
};

export const {
  NODE_ENV,
  LOGGER_LOG_LEVEL,
  LOGGER_SERVICE_LABEL,
  LOGGER_LOGTAIL_SOURCE_TOKEN,
} = getConfig();
