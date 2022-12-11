import type { Params } from '@remix-run/react';

export function validateSteamAppId(params: Params) {
  if (!params.steamAppId) {
    throw new Response('Expected params.steamAppid', { status: 400 });
  }
  const steamAppId = Number(params.steamAppId);
  if (!isFinite(steamAppId) || steamAppId < 0) {
    throw new Response('steam appid must be a valid positive number', { status: 400 });
  }
  return steamAppId;
}
