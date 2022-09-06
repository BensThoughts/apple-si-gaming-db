"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  getSteamAppDetailsRequest: () => getSteamAppDetailsRequest,
  getSteamAppListRequest: () => getSteamAppListRequest,
  getSteamPlayerOwnedGamesRequest: () => getSteamPlayerOwnedGamesRequest
});
module.exports = __toCommonJS(src_exports);

// src/steamApi.ts
var import_axios = __toESM(require("axios"));
var import_tiny_invariant = __toESM(require("tiny-invariant"));
var import_logger = __toESM(require("@apple-si-gaming-db/logger"));
async function getSteamAppDetailsRequest(steamAppId) {
  try {
    const response = await import_axios.default.get("https://store.steampowered.com/api/appdetails/", {
      params: {
        appids: steamAppId
      },
      responseType: "json"
    });
    (0, import_tiny_invariant.default)(response.status === 200, `Response status was not 200, response.status: ${response.status}`);
    const steamApiResponse = response.data;
    return steamApiResponse[String(steamAppId)];
  } catch (err) {
    if (err instanceof Error) {
      import_logger.default.error("Error in getSteamAppDetailsRequest");
      throw err;
    }
    throw err;
  }
}
async function getSteamPlayerOwnedGamesRequest(steamUserId) {
  try {
    const apiKey = process.env.STEAM_API_KEY;
    (0, import_tiny_invariant.default)(apiKey, "No Steam API key found, check ENV vars");
    const response = await import_axios.default.get("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/", {
      params: {
        key: apiKey,
        steamid: steamUserId,
        format: "json"
      },
      responseType: "json"
    });
    (0, import_tiny_invariant.default)(response.status === 200, `Response status was not 200, response.status: ${response.status}`);
    return response.data.response;
  } catch (err) {
    if (err instanceof Error) {
      import_logger.default.error("Error in getSteamPlayerOwnedGamesRequest");
      throw err;
    }
    throw err;
  }
}
async function getSteamAppListRequest() {
  try {
    const response = await import_axios.default.get(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/",
      {
        responseType: "json"
      }
    );
    (0, import_tiny_invariant.default)(response.status === 200, `Response status was not 200, response.status: ${response.status}`);
    const steamApiResponse = response.data;
    return steamApiResponse;
  } catch (err) {
    if (err instanceof Error) {
      import_logger.default.error("Error in getSteamAppListRequest");
      throw err;
    }
    throw err;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSteamAppDetailsRequest,
  getSteamAppListRequest,
  getSteamPlayerOwnedGamesRequest
});
//# sourceMappingURL=index.js.map