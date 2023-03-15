import axios from 'axios';
import type { AxiosResponse } from 'axios';
import invariant from 'tiny-invariant';
import type {
  SteamApiAppDetailsResponse,
  SteamApiAppListResponse,
  SteamApiGetOwnedGamesResponse,
} from './interfaces';

import { logger } from './logger';
import {
  STEAM_API_KEY,
  STEAM_API_APP_DETAILS_ENDPOINT,
  STEAM_API_GET_OWNED_GAMES_ENDPOINT,
  STEAM_API_APP_LIST_ENDPOINT,
} from './config';

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

const logDebug = ({
  message,
  endpoint,
  steamAppId,
  steamUserId64,
  response,
}: {
  endpoint: string;
  message: string;
  steamAppId?: number;
  steamUserId64?: string;
  response?: AxiosResponse<any, any>;
}) => {
  logger.debug(message, {
    metadata: {
      userSession: steamUserId64 ? {
        steamUserProfile: { steamUserId: steamUserId64 },
      } : undefined,
      steamApp: steamAppId ? { steamAppId } : undefined,
      extra: {
        endpoint,
        axios: response ? filterAxiosResponse(response) : undefined,
      },
    },
  });
};

interface SteamApiResponse {
  [appid: string]: SteamApiAppDetailsResponse;
}

export async function getSteamAppDetailsRequest(
    steamAppId: number,
): Promise<SteamApiAppDetailsResponse> {
  try {
    logDebug({
      message: `starting request for app details to ${STEAM_API_APP_DETAILS_ENDPOINT} for steamAppId ${steamAppId}`,
      endpoint: STEAM_API_APP_DETAILS_ENDPOINT,
      steamAppId,
    });
    const response = await axios.get<SteamApiResponse>(STEAM_API_APP_DETAILS_ENDPOINT, {
      params: {
        appids: steamAppId,
        l: 'english',
      },
      responseType: 'json',
    });
    logDebug({
      message: `received response for app details from ${STEAM_API_APP_DETAILS_ENDPOINT} for steamAppId ${steamAppId}`,
      endpoint: STEAM_API_APP_DETAILS_ENDPOINT,
      steamAppId,
      response,
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
): Promise<{
  success: boolean;
  data?: SteamApiGetOwnedGamesResponse['response']
}> {
  try {
    logDebug({
      message: `starting request for player owned games to ${STEAM_API_GET_OWNED_GAMES_ENDPOINT} for steamUserId64: ${steamUserId64}`,
      endpoint: STEAM_API_GET_OWNED_GAMES_ENDPOINT,
      steamUserId64,
    });
    const response = await axios.get<SteamApiGetOwnedGamesResponse>(STEAM_API_GET_OWNED_GAMES_ENDPOINT, {
      params: {
        'key': STEAM_API_KEY,
        'steamid': steamUserId64,
        'format': 'json',
        'include_played_free_games': 'true',
      },
      responseType: 'json',
    });
    logDebug({
      message: `received response for player owned games from ${STEAM_API_GET_OWNED_GAMES_ENDPOINT} for steamUserId64: ${steamUserId64}`,
      endpoint: STEAM_API_GET_OWNED_GAMES_ENDPOINT,
      steamUserId64,
      response,
    });
    invariant(response.status === 200, `response status was not 200, response.status: ${response.status}`);
    if ('games' in response.data.response) {
      return {
        success: true,
        data: response.data.response,
      };
    }
    return {
      success: false,
    };
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
  try {
    logDebug({
      message: `starting request to ${STEAM_API_APP_LIST_ENDPOINT}`,
      endpoint: STEAM_API_APP_LIST_ENDPOINT,
    });
    const response = await axios.get<SteamApiAppListResponse>(
        STEAM_API_APP_LIST_ENDPOINT, {
          responseType: 'json',
        });
    logDebug({
      message: `received response from ${STEAM_API_APP_LIST_ENDPOINT}`,
      endpoint: STEAM_API_APP_LIST_ENDPOINT,
      response,
    });
    invariant(response.status === 200, `response status was not 200, response.status: ${response.status}`);
    const steamApiResponse = response.data;
    return steamApiResponse;
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message, { error: err });
    } else {
      logger.error(err);
    }
    throw err;
  }
}
