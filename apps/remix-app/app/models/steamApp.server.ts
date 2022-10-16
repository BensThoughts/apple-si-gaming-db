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
 * @param  {number} skip
 * @param  {number} take
 * @param  {boolean} platformMac?
 */
export async function searchReleasedSteamAppsByName(
    searchQuery: SteamApp['name'],
    skip: number,
    take: number,
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
    skip,
    take,
  });
}

export interface TrendingSteamApp {
  steamAppId: number;
  name: string;
  headerImage: string | null;
  releaseDate: string | null;
  _count: {
    performancePosts: number,
  }
}

export async function findTrendingSteamApps(
    numTrendingApps: number,
) {
  return prisma.steamApp.findMany({
    where: {
      performancePosts: {
        some: {},
      },
    },
    select: {
      steamAppId: true,
      name: true,
      headerImage: true,
      releaseDate: true,
      _count: {
        select: {
          performancePosts: true,
        },
      },
    },
    orderBy: {
      performancePosts: {
        _count: 'desc',
      },
    },
    take: numTrendingApps,
  });
}
