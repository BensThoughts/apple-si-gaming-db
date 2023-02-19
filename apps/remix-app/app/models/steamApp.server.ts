import {
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  convertSteamApiDataToPrisma,
} from '@apple-si-gaming-db/database';

import type {
  Prisma,
  PrismaSteamApp,
  PrismaSteamGenre,
  PrismaSteamCategory,
} from '~/interfaces/database';
import type { TrendingSteamApp } from '~/interfaces';

import prisma from '~/lib/database/db.server';

export {
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  convertSteamApiDataToPrisma,
};

/**
 * Filter to keep only appIds that exist in db. The steam api
 * may return app ids for some users that do not exist in the db
 * and would throw an error when trying to connect records.
 * @param  {number[]} steamAppIds
 * @return {Promise<number[]>}
 */
export async function filterAppIdsExistInDatabase(
    steamAppIds: PrismaSteamApp['steamAppId'][],
) {
  const steamAppIdsInDB = await prisma.steamApp.findMany({
    where: {
      steamAppId: { in: steamAppIds },
    },
    select: {
      steamAppId: true,
    },
  });
  return steamAppIdsInDB.map((app) => app.steamAppId);
}

export async function findSteamAppByAppId(
    steamAppId: PrismaSteamApp['steamAppId'],
) {
  return prisma.steamApp.findUnique({
    where: {
      steamAppId,
    },
    select: {
      steamAppId: true,
      categories: true,
      dataDownloadAttempted: true,
      dataDownloadAttemptedAt: true,
      dataDownloaded: true,
      genres: true,
      headerImage: true,
      name: true,
      platformLinux: true,
      platformMac: true,
      platformWindows: true,
      releaseDate: true,
      requiredAge: true,
      shortDescription: true,
      pcRequirementsMinimum: true,
      macRequirementsMinimum: true,
      linuxRequirementsMinimum: true,
    },
  });
}


interface SearchReleasedSteamAppsByNameProps {
  searchQuery: PrismaSteamApp['name'];
  skip: number;
  take: number;
  whereOptions?: {
    platformMac?: PrismaSteamApp['platformMac'];
    genreIds?: PrismaSteamGenre['genreId'][];
    categoryIds?: PrismaSteamCategory['categoryId'][];
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

      // * This is exclusive, must meet all tags
      AND: andClause.length > 0 ? andClause : undefined,

      // * This is inclusive meats any of the tags
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
      // comingSoon: {
      //   equals: false,
      // },
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
  const trendingSteamApps = await prisma.steamApp.findMany({
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
  return trendingSteamApps.map(({
    steamAppId,
    name,
    headerImage,
    _count: {
      performancePosts,
    },
  }) => ({
    steamAppId,
    name,
    headerImage,
    numPerformancePosts: performancePosts,
  }));
}

export function findSteamAppsWherePostsExist() {
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
      platformMac: true,
      genres: {
        select: {
          genreId: true,
          description: true,
        },
      },
    },
  });
}
