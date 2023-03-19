import { getSteamPlayerOwnedGamesRequest } from '~/lib/data-utils/steamApi.server';
import { filterAppIdsExistInDatabase } from './steamApp.server';
import type { PrismaSteamApp } from '~/interfaces/database';
import prisma from '~/lib/database/db.server';
import type { SteamAppForSmallAppsGridLayout } from '~/interfaces';

export async function updateSteamUserProfileOwnedSteamApps(
    steamUserId64: string,
) {
  const { success, data } = await getSteamPlayerOwnedGamesRequest(steamUserId64);
  if (success && data && data.games) {
    const { games } = data;
    const ownedAppIds = games.map((app) => app.appid);
    const ownedAppIdsInDB = await filterAppIdsExistInDatabase(ownedAppIds);
    await prisma.steamUserProfile.update({
      where: {
        steamUserId64: BigInt(steamUserId64),
      },
      data: {
        ownedSteamApps: {
          connect: ownedAppIdsInDB.map((steamAppId) => ({
            steamAppId,
          })),
        },
      },
    });
    return {
      success,
    };
  }
  return {
    success,
  };
}

export async function doesSteamUserProfileExistInDB(steamUserId64: string) {
  const steamUserProfileCount = await prisma.steamUserProfile.count({
    where: {
      steamUserId64: BigInt(steamUserId64),
    },
  });
  return steamUserProfileCount > 0 ? true : false;
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

export async function findSteamUserProfileOwnedSteamApps(steamUserId64: string): Promise<SteamAppForSmallAppsGridLayout[]> {
  const steamUserProfile = await prisma.steamUserProfile.findUnique({
    where: {
      steamUserId64: BigInt(steamUserId64),
    },
    select: {
      ownedSteamApps: {
        where: {
          comingSoon: {
            equals: false,
          },
          type: {
            contains: 'game',
            mode: 'insensitive',
          },
        },
        orderBy: {
          name: 'asc',
        },
        select: {
          steamAppId: true,
          genres: true,
          headerImage: true,
          name: true,
          platformMac: true,
        },
      },
    },
  });
  if (!steamUserProfile) {
    return [];
  }
  return steamUserProfile.ownedSteamApps;
}
