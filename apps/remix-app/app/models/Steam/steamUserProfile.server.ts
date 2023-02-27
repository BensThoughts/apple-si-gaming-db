import { getSteamPlayerOwnedGamesRequest } from '~/lib/data-utils/steamApi.server';
import { filterAppIdsExistInDatabase } from './steamApp.server';
import type { PrismaSteamApp } from '~/interfaces/database';
import prisma from '~/lib/database/db.server';

export async function updateSteamUserProfileOwnedSteamApps(
    steamUserId64: string,
) {
  const { games } = await getSteamPlayerOwnedGamesRequest(steamUserId64);
  if (games) {
    const ownedAppIds = games.map((app) => app.appid);
    const ownedAppIdsInDB = await filterAppIdsExistInDatabase(ownedAppIds);
    await updateSteamUserProfileOwnedAppsInDatabase(ownedAppIdsInDB, steamUserId64);
  }
}

export async function updateSteamUserProfileOwnedAppsInDatabase(
    steamAppIds: PrismaSteamApp['steamAppId'][],
    steamUserId64: string,
) {
  return prisma.steamUserProfile.update({
    where: {
      steamUserId64: BigInt(steamUserId64),
    },
    data: {
      ownedSteamApps: {
        connect: steamAppIds.map((steamAppId) => ({
          steamAppId,
        })),
      },
    },
  });
}

export async function doesSteamUserOwnApp(
    steamUserId64: string,
    steamAppId: PrismaSteamApp['steamAppId'],
) {
// const testCount = await prisma.steamUser.count({
//   where: {
//     steamUserId,
//     ownedApps: {
//       some: {
//         steamAppId,
//       },
//     },
//   },
// });
  const steamUser = await prisma.steamUserProfile.findUnique({
    where: {
      steamUserId64: BigInt(steamUserId64),
    },
    select: {
      ownedSteamApps: {
        where: {
          steamAppId,
        },
        select: {
          steamAppId: true,
        },
      },
    },
  });
  if (!steamUser) {
    return false;
  }
  return steamUser.ownedSteamApps.map((app) => app.steamAppId).includes(steamAppId);
}
