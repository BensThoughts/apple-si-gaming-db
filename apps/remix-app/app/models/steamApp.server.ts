import {
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  convertSteamApiDataToPrisma,
} from '@apple-si-gaming-db/database';

import type {
  Prisma,
  SteamApp,
  SteamGenre,
  SteamCategory,
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


interface SearchReleasedSteamAppsByNameProps {
  searchQuery: SteamApp['name'];
  skip: number;
  take: number;
  whereOptions?: {
    platformMac?: SteamApp['platformMac'];
    genreIds?: SteamGenre['genreId'][];
    categoryIds?: SteamCategory['categoryId'][];
  },
}

export async function searchReleasedSteamAppsByName(
    searchOptions: SearchReleasedSteamAppsByNameProps,
) {
  const {
    searchQuery,
    skip,
    take,
    whereOptions,
  } = searchOptions;
  let whereInput: Prisma.SteamAppWhereInput = {};
  if (whereOptions) {
    const {
      platformMac,
      genreIds,
      categoryIds,
    } = whereOptions;
    whereInput = {
      platformMac,
      // AND: genreIds ? {

      // } : undefined,
      // TODO: This is inclusive, is it possible to make it exclusive?
      genres: genreIds ? {
        some: {
          OR: genreIds.map((genreId) => ({
            genreId: {
              equals: genreId,
            },
          })),
        },
      } : undefined,
      categories: categoryIds ? {
        some: {
          OR: categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
      } : undefined,
    };
  }
  return prisma.steamApp.findMany({
    where: {
      name: {
        contains: searchQuery,
        mode: 'insensitive',
      },
      comingSoon: {
        equals: false,
      },
      type: {
        contains: 'game',
        mode: 'insensitive',
      },
      ...whereInput,
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
