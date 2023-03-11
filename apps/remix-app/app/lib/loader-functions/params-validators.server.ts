import type { Params } from '@remix-run/react';

export function validateSteamAppId(params: Params) {
  if (!params.steamAppId) {
    throw new Response('expected params.steamAppid', { status: 400 });
  }
  const steamAppId = Number(params.steamAppId);
  if (!isFinite(steamAppId) || steamAppId < 0) {
    throw new Response(`Steam appid ${steamAppId} is not a valid positive number`,
        { status: 400 },
    );
  }
  if (steamAppId > 2147483647) { // the max Int size in postgres
    throw new Response(`Steam appid ${steamAppId} is to large, must be less than 2147483647`,
        { status: 400 });
  }

  return steamAppId;
}

export function validatePerformancePostId(params: Params) {
  if (!params.performancePostId) {
    throw new Response('expected params.performancePostId', { status: 400 });
  }
  const performancePostId = Number(params.performancePostId);
  if (!isFinite(performancePostId) || performancePostId < 0) {
    throw new Response('post id must be a valid positive number', { status: 400 });
  }
  return performancePostId;
}


