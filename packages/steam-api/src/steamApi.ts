import axios from 'axios';
import type { AxiosResponse } from 'axios';
import invariant from 'tiny-invariant';
import type {
  SteamApiAppDetailsResponse,
  SteamApiAppListResponse,
  SteamApiGetOwnedGamesResponse,
} from './interfaces';

// import { createId } from '@paralleldrive/cuid2';
import { getLogger } from '@apple-si-gaming-db/logger';
const logger = getLogger('packages-steam-api');

const filterAxiosResponse = (response: AxiosResponse) => {
  const { config } = response;
  const {
    url,
    headers,
    params,
    responseType,
    responseEncoding,
    xsrfCookieName,
    xsrfHeaderName,
    method,
  } = config;
  const {
    key,
    ...restParams
  } = params;
  const info = {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    config: {
      url,
      headers,
      params: {
        ...restParams,
      },
      responseType,
      responseEncoding,
      xsrfCookieName,
      xsrfHeaderName,
      method,
    },
    // request: {
    //   _header: response.request._header,
    //   method: response.request.method,
    //   host: response.request.host,
    //   path: response.request.path,
    // },
  };
  return info;
};

interface SteamApiResponse {
  [appid: string]: SteamApiAppDetailsResponse;
}

export async function getSteamAppDetailsRequest(
    steamAppId: number,
): Promise<SteamApiAppDetailsResponse> {
  const appDetailEndpoint = 'https://store.steampowered.com/api/appdetails/';
  try {
    logger.debug(
        `starting request for app details to ${appDetailEndpoint} for steamAppId: ${steamAppId}`,
        {
          metadata: {
            steamApp: { steamAppId },
            extra: { endpoint: appDetailEndpoint },
          },
        });
    const response = await axios.get<SteamApiResponse>(appDetailEndpoint, {
      params: {
        appids: steamAppId,
        l: 'english',
      },
      responseType: 'json',
    });
    logger.debug(
        `received response for app details from ${appDetailEndpoint} for steamAppId ${steamAppId}`,
        {
          metadata: {
            steamApp: { steamAppId },
            extra: {
              endpoint: appDetailEndpoint,
              axios: { ...filterAxiosResponse(response) },
            },
          },
        });
    invariant(response.status === 200, `Response status was not 200, response.status: ${response.status}`);
    const steamApiResponse = response.data;
    return steamApiResponse[String(steamAppId)];
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message, {
        error: {
          message: err.message,
          name: err.name,
          stack: err.stack,
        },
        metadata: {
          steamApp: {
            steamAppId,
          },
        },
      });
    } else {
      logger.error(err);
    }
    throw err;
  }
}

/*
 * steamId is the steam users 64-bit id
 */

export async function getSteamPlayerOwnedGamesRequest(
    steamUserId64: string,
): Promise<SteamApiGetOwnedGamesResponse['response']> {
  const getOwnedGamesEndpoint = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/';
  try {
    const apiKey = process.env.ASGD_STEAM_API_KEY;
    invariant(apiKey, 'no Steam API key found, check ENV var ASGD_STEAM_API_KEY');
    logger.debug(
        `starting request for player owned games to ${getOwnedGamesEndpoint} for steamUserId64: ${steamUserId64}`,
        {
          metadata: {
            userSession: {
              steamUserProfile: { steamUserId: steamUserId64 },
            },
            extra: { endpoint: getOwnedGamesEndpoint },
          },
        });
    const response = await axios.get<SteamApiGetOwnedGamesResponse>(getOwnedGamesEndpoint, {
      params: {
        key: apiKey,
        steamid: steamUserId64,
        format: 'json',
      },
      responseType: 'json',
    });
    logger.debug(
        `received response for player owned games from ${getOwnedGamesEndpoint} for steamUserId64: ${steamUserId64}`,
        {
          metadata: {
            userSession: {
              steamUserProfile: { steamUserId: steamUserId64 },
            },
            extra: {
              endpoint: getOwnedGamesEndpoint,
              axios: { ...filterAxiosResponse(response) },
            },
          },
        });
    invariant(response.status === 200, `response status was not 200, response.status: ${response.status}`);
    return response.data.response;
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message, {
        error: {
          name: err.name,
          message: err.message,
          stack: err.stack,
        },
        metadata: {
          userSession: {
            steamUserProfile: {
              steamUserId: steamUserId64,
            },
          },
        },
      });
    } else {
      logger.error(err);
    }
    throw err;
  }
}

export async function getSteamAppListRequest(): Promise<SteamApiAppListResponse> {
  const appListEndpoint = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
  try {
    logger.debug(`starting request to ${appListEndpoint}`);
    const response = await axios.get<SteamApiAppListResponse>(
        appListEndpoint, {
          responseType: 'json',
        });
    logger.debug(`received response from ${appListEndpoint}`, {
      metadata: {
        extra: {
          axios: { ...filterAxiosResponse(response) },
        },
      },
    });
    invariant(response.status === 200, `response status was not 200, response.status: ${response.status}`);
    const steamApiResponse = response.data;
    return steamApiResponse;
  } catch (err) {
    logger.error(err);
    // logger.error('Error in getSteamAppListRequest');
    // throw new Error('Error in getSteamAppDetailsRequest', { cause: err });
    throw err;
  }
}
