import axios from 'axios';
import invariant from 'tiny-invariant';
import type {
  SteamApiAppDetailsResponse,
  SteamApiAppListResponse,
  SteamApiGetOwnedGamesResponse,
} from './interfaces';

import { logger } from '@apple-si-gaming-db/logger';

interface SteamApiResponse {
  [appid: string]: SteamApiAppDetailsResponse;
}

export async function getSteamAppDetailsRequest(
    steamAppId: number,
): Promise<SteamApiAppDetailsResponse> {
  try {
    const response = await axios.get<SteamApiResponse>('https://store.steampowered.com/api/appdetails/', {
      params: {
        appids: steamAppId,
      },
      responseType: 'json',
    });
    invariant(response.status === 200, `Response status was not 200, response.status: ${response.status}`);
    const steamApiResponse = response.data;
    return steamApiResponse[String(steamAppId)];
  } catch (err) {
    if (err instanceof Error) {
      logger.error('Error in getSteamAppDetailsRequest');
      // throw new Error('Error in getSteamAppDetailsRequest', { cause: err });
      throw err;
    }
    throw err;
  }
}

/*
 * steamId is the steam users 64-bit id
 */

export async function getSteamPlayerOwnedGamesRequest(
    steamUserId: string,
): Promise<SteamApiGetOwnedGamesResponse['response']> {
  try {
    const apiKey = process.env.ASGD_STEAM_API_KEY;
    invariant(apiKey, 'No Steam API key found, check ENV vars');
    const response = await axios.get<SteamApiGetOwnedGamesResponse>('https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/', {
      params: {
        key: apiKey,
        steamid: steamUserId,
        format: 'json',
      },
      responseType: 'json',
    });
    invariant(response.status === 200, `Response status was not 200, response.status: ${response.status}`);
    return response.data.response;
  } catch (err) {
    if (err instanceof Error) {
      logger.error('Error in getSteamPlayerOwnedGamesRequest');
      throw err;
      // throw new Error('Error in getSteamPlayerOwnedGamesRequest', {
      //   cause: err,
      // });
    }
    throw err;
  }
}

export async function getSteamAppListRequest(): Promise<SteamApiAppListResponse> {
  try {
    const response = await axios.get<SteamApiAppListResponse>(
        'https://api.steampowered.com/ISteamApps/GetAppList/v2/', {
          responseType: 'json',
        });
    invariant(response.status === 200, `Response status was not 200, response.status: ${response.status}`);
    const steamApiResponse = response.data;
    return steamApiResponse;
  } catch (err) {
    if (err instanceof Error) {
      logger.error('Error in getSteamAppListRequest');
      // throw new Error('Error in getSteamAppDetailsRequest', { cause: err });
      throw err;
    }
    throw err;
  }
}
