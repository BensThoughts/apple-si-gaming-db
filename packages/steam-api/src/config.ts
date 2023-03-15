import { logger } from './logger';

const getConfig = () => {
  const STEAM_API_KEY = process.env.STEAM_API_KEY;
  if (!STEAM_API_KEY) {
    logger.error('env var STEAM_API_KEY is not set, please set the environment variable');
    process.exit(1);
  }
  logger.info(`env var STEAM_API_KEY is set for packages/steam-api`);

  const STEAM_API_APP_DETAILS_ENDPOINT =
    process.env.STEAM_API_APP_DETAILS_ENDPOINT ||
    'https://store.steampowered.com/api/appdetails/';
  logger.info(`env var STEAM_API_APP_DETAILS_ENDPOINT for packages/steam-api is set to ${STEAM_API_APP_DETAILS_ENDPOINT}`);

  // ! 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/' both
  // ! endpoints seem to work, not sure which is more correct
  const STEAM_API_GET_OWNED_GAMES_ENDPOINT =
    process.env.STEAM_API_GET_OWNED_GAMES_ENDPOINT ||
    'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/';
  logger.info(`env var STEAM_API_GET_OWNED_GAMES_ENDPOINT for packages/steam-api is set to ${STEAM_API_GET_OWNED_GAMES_ENDPOINT}`);

  const STEAM_API_APP_LIST_ENDPOINT =
    process.env.STEAM_API_APP_LIST_ENDPOINT ||
    'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
  logger.info(`env var STEAM_API_APP_LIST_ENDPOINT for packages/steam-api is set to ${STEAM_API_APP_LIST_ENDPOINT}`);

  return {
    STEAM_API_KEY,
    STEAM_API_APP_DETAILS_ENDPOINT,
    STEAM_API_GET_OWNED_GAMES_ENDPOINT,
    STEAM_API_APP_LIST_ENDPOINT,
  };
};

const {
  STEAM_API_KEY,
  STEAM_API_APP_DETAILS_ENDPOINT,
  STEAM_API_GET_OWNED_GAMES_ENDPOINT,
  STEAM_API_APP_LIST_ENDPOINT,
} = getConfig();

export {
  STEAM_API_KEY,
  STEAM_API_APP_DETAILS_ENDPOINT,
  STEAM_API_GET_OWNED_GAMES_ENDPOINT,
  STEAM_API_APP_LIST_ENDPOINT,
};
