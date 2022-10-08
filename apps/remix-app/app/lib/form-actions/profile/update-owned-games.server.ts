import type { SteamUser } from '@apple-si-gaming-db/database';
import { getSteamPlayerOwnedGamesRequest } from '@apple-si-gaming-db/steam-api';
import { redirect } from '@remix-run/node';
import { searchAllAppsByAppIds } from '~/models/steamApp.server';
import { updateUserOwnedApps } from '~/models/steamUser.server';

export async function updateOwnedGames(
    steamUserId: SteamUser['steamUserId'],
) {
  const { games } = await getSteamPlayerOwnedGamesRequest(steamUserId);
  if (games) {
    const ownedAppIds = games.map((app) => app.appid);

    const ownedAppsInDB = await searchAllAppsByAppIds(ownedAppIds);
    const ownedAppIdsInDB = ownedAppsInDB.map((app) => app.steamAppId);
    await updateUserOwnedApps(ownedAppIdsInDB, steamUserId);
  }

  return redirect('/profile');
}
