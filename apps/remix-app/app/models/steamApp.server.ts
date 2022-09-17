import {
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  convertSteamApiDataToPrisma,
} from '@apple-si-gaming-db/database';

import type {
  SteamAppWithoutMetadata,
  SteamUserWithoutMetadata,
} from '~/interfaces/database';

import prisma from '~/lib/database/db.server';

export {
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  convertSteamApiDataToPrisma,
};

export async function searchAllAppsByAppIds(
    steamAppIds: SteamAppWithoutMetadata['steamAppId'][],
) {
  return prisma.steamApp.findMany({
    where: {
      steamAppId: { in: steamAppIds },
    },
    select: {
      steamAppId: true,
      // name: true,
      // headerImage: true,
    },
  });
}

export async function searchSteamAppByAppId(
    steamAppId: SteamAppWithoutMetadata['steamAppId'],
    steamUserId?: SteamUserWithoutMetadata['steamUserId'],
) {
  return prisma.steamApp.findUnique({
    where: {
      steamAppId,
    },
    select: {
      steamAppId: true,
      name: true,
      dataDownloadAttempted: true,
      dataDownloaded: true,
      headerImage: true,
      type: true,
      requiredAge: true,
      controllerSupport: true,
      shortDescription: true,
      releaseDate: true,
      platformMac: true,
      platformLinux: true,
      platformWindows: true,
      pcRequirementsMinimum: true,
      macRequirementsMinimum: true,
      linuxRequirementsMinimum: true,
      genres: true,
      categories: true,
      performancePosts: {
        select: {
          id: true,
          steamUser: {
            select: {
              steamUserId: true,
              displayName: true,
              avatarMedium: true,
            },
          },
          postText: true,
          steamAppId: true,
        },
      },
      usersWhoOwnApp: {
        where: {
          steamUserId,
        },
        select: {
          steamUserId: true,
        },
      },
    },
  });
}

export async function searchReleasedSteamAppsByName(
    name: SteamAppWithoutMetadata['name'],
) {
  return prisma.steamApp.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive',
      },
      // platformMac: {
      //   equals: true,
      // },
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
      name: true,
      headerImage: true,
      releaseDate: true,
    },
  });
}
