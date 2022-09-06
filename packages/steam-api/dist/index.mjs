// src/steamApi.ts
import axios from "axios";
import invariant from "tiny-invariant";
import logger from "@apple-si-gaming-db/logger";
async function getSteamAppDetailsRequest(steamAppId) {
  try {
    const response = await axios.get("https://store.steampowered.com/api/appdetails/", {
      params: {
        appids: steamAppId
      },
      responseType: "json"
    });
    invariant(response.status === 200, `Response status was not 200, response.status: ${response.status}`);
    const steamApiResponse = response.data;
    return steamApiResponse[String(steamAppId)];
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Error in getSteamAppDetailsRequest");
      throw err;
    }
    throw err;
  }
}
async function getSteamPlayerOwnedGamesRequest(steamUserId) {
  try {
    const apiKey = process.env.STEAM_API_KEY;
    invariant(apiKey, "No Steam API key found, check ENV vars");
    const response = await axios.get("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/", {
      params: {
        key: apiKey,
        steamid: steamUserId,
        format: "json"
      },
      responseType: "json"
    });
    invariant(response.status === 200, `Response status was not 200, response.status: ${response.status}`);
    return response.data.response;
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Error in getSteamPlayerOwnedGamesRequest");
      throw err;
    }
    throw err;
  }
}
async function getSteamAppListRequest() {
  try {
    const response = await axios.get(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/",
      {
        responseType: "json"
      }
    );
    invariant(response.status === 200, `Response status was not 200, response.status: ${response.status}`);
    const steamApiResponse = response.data;
    return steamApiResponse;
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Error in getSteamAppListRequest");
      throw err;
    }
    throw err;
  }
}
export {
  getSteamAppDetailsRequest,
  getSteamAppListRequest,
  getSteamPlayerOwnedGamesRequest
};
//# sourceMappingURL=index.mjs.map