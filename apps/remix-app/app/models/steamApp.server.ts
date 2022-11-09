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
import type { TrendingSteamApp } from '~/interfaces';

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
    const andClause: Prisma.Enumerable<Prisma.SteamAppWhereInput> = [];
    if (genreIds) {
      genreIds.forEach((genreId) => {
        andClause.push({
          genres: {
            some: {
              genreId,
            },
          },
        });
      });
    }
    if (categoryIds) {
      categoryIds.forEach((categoryId) => {
        andClause.push({
          categories: {
            some: {
              categoryId,
            },
          },
        });
      });
    }
    whereInput = {
      platformMac,
      // TODO: This is exclusive, must meet all tags
      AND: andClause.length > 0 ? andClause : undefined,
      // TODO: This is inclusive meats any of the tags
      // genres: genreIds ? {
      //   some: {
      //     OR: genreIds.map((genreId) => ({
      //       genreId: {
      //         equals: genreId,
      //       },
      //     })),
      //   },
      // } : undefined,
      // categories: categoryIds ? {
      //   some: {
      //     OR: categoryIds.map((categoryId) => ({
      //       categoryId,
      //     })),
      //   },
      // } : undefined,
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

export async function findTrendingSteamApps(
    numTrendingApps: number,
): Promise<TrendingSteamApp[]> {
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
