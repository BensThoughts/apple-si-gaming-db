import {
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  convertSteamApiDataToPrisma,
} from '@apple-si-gaming-db/database';

import type {
  SteamApp,
} from '~/interfaces/database';

import prisma from '~/lib/database/db.server';

export {
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  convertSteamApiDataToPrisma,
};

export async function searchAllAppsByAppIds(
    steamAppIds: SteamApp['steamAppId'][],
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
    steamAppId: SteamApp['steamAppId'],
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
    },
  });
}

/**
 * Search DB for apps by name (page 1 is first page)
 * @param  {string} searchQuery
 * @param  {number} pageSize
 * @param  {number} page
 * @param  {boolean} platformMac?
 */
export async function searchReleasedSteamAppsByName(
    searchQuery: SteamApp['name'],
    pageSize: number,
    page: number,
    platformMac?: boolean,
) {
  return prisma.steamApp.findMany({
    where: {
      name: {
        contains: searchQuery,
        mode: 'insensitive',
      },
      platformMac: platformMac ? {
        equals: platformMac,
      } : undefined,
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
    skip: pageSize * (page - 1),
    take: pageSize,
  });
}
