import invariant from 'tiny-invariant';

const getConfig = () => {
  const LOGGER_SERVICE_LABEL = process.env.LOGGER_SERVICE_LABEL;
  invariant(typeof LOGGER_SERVICE_LABEL === 'string', 'LOGGER_SERVICE_LABEL env var not set');
  const LOGTAIL_SOURCE_TOKEN = process.env.LOGTAIL_SOURCE_TOKEN;
  const NODE_ENV = process.env.NODE_ENV;
  return {
    NODE_ENV,
    LOGGER_SERVICE_LABEL,
    LOGTAIL_SOURCE_TOKEN,
  };
};

export const {
  NODE_ENV,
  LOGGER_SERVICE_LABEL,
  LOGTAIL_SOURCE_TOKEN,
} = getConfig();
