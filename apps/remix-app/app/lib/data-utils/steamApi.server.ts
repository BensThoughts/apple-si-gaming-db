import type { SteamApp, SteamUser } from '@prisma/client';
import axios from 'axios';
import invariant from 'tiny-invariant';
import type {
  SteamApiAppDetailsResponse,
  SteamApiGetOwnedGamesResponse,
} from '~/interfaces';

interface SteamApiResponse {
  [appid: string]: SteamApiAppDetailsResponse;
}

export async function getSteamAppDetailsRequest(steamAppId: SteamApp['steamAppId']) {
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
      throw new Error('Error in getSteamAppDetailsRequest', { cause: err });
    }
    throw err;
  }
}

/*
 * steamId is the steam users 64-bit id
 */

export async function getSteamPlayerOwnedGamesRequest(steamUserId: SteamUser['steamUserId']) {
  try {
    const apiKey = process.env.STEAM_API_KEY;
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
      throw new Error('Error in getSteamPlayerOwnedGamesRequest', {
        cause: err,
      });
    }
    throw err;
  }
}
