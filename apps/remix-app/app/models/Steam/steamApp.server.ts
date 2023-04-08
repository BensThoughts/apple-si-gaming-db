// import {
//   updateSteamApp,
//   updateSteamAppDownloadAttempted,
//   convertSteamApiDataToPrisma,
// } from '@apple-si-gaming-db/database';

import type {
  Prisma,
  PrismaSteamApp,
  PrismaSteamGenre,
  PrismaSteamCategory,
} from '~/types/database';
import type {
  TrendingSteamApp,
  SteamAppForSmallAppsGridLayout,
  SteamAppForSearchPage,
  SteamApp,
} from '~/types';

import prisma from '~/lib/database/db.server';
import { logger } from '~/lib/logger/logger.server';

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
): Promise<SteamApp | null> {
  const steamApp = await prisma.steamApp.findUnique({
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
  if (!steamApp) {
    return null;
  }
  const DAYS_TILL_STALE_DATA = 7;
  const isMoreThanDaysAgo = (dateToTest: Date, daysAgo: number) => {
    const daysAgoInMs = daysAgo * 24 * 60 * 60 * 1000; // days  hours min  sec  ms
    const timestampDaysAgo = new Date().getTime() - daysAgoInMs;
    if (timestampDaysAgo > dateToTest.getTime()) {
      return true;
    } else {
      return false;
    }
  };
  let dataNeedsRefresh = false;
  if (
    !steamApp.dataDownloadAttempted ||
    !steamApp.dataDownloaded ||
    (
      steamApp.dataDownloadAttemptedAt &&
      isMoreThanDaysAgo(steamApp.dataDownloadAttemptedAt, DAYS_TILL_STALE_DATA)
    )
  ) {
    dataNeedsRefresh = true;
    logger.info(
        `stale data for steam app with steamAppId ${steamAppId} found, last dataDownloadAttemptedAt is more than ${DAYS_TILL_STALE_DATA} days old for ${steamApp.name}`, {
          metadata: {
            steamApp: {
              steamAppId,
              name: steamApp.name,
            },
            extra: {
              dataDownloadAttemptedAt: steamApp.dataDownloadAttemptedAt,
            },
          },
        },
    );
  }
  return {
    ...steamApp,
    dataNeedsRefresh,
  };
}

// const steamApiApp = await getSteamAppDetailsRequest(steamApp.steamAppId);
// if (steamApiApp.data) {
//   const prismaSteamApp = convertSteamApiDataToPrisma(steamApiApp.data);
//   // TODO: Performing these updates in a loader doesn't work when
//   // TODO: the fly app is not in primary region, ALL mutations need to
//   // TODO: somehow move to an action
//   await updateSteamApp(prismaSteamApp);
//   steamApp = await findSteamAppByAppId(steamAppId);
// }
// if (!steamApp) {
//   throw throwSteamAppError();
// }

export async function searchReleasedSteamAppsByName({
  appName,
  skip,
  take,
  whereOptions,
}: {
  appName: PrismaSteamApp['name'];
  skip: number;
  take: number;
  whereOptions?: {
    platformMac?: PrismaSteamApp['platformMac'];
    genreIds?: PrismaSteamGenre['id'][];
    categoryIds?: PrismaSteamCategory['id'][];
  },
}): Promise<SteamAppForSearchPage[]> {
  let whereInput: Prisma.SteamAppWhereInput = {};
  if (whereOptions) {
    const {
      platformMac,
      genreIds,
      categoryIds,
    } = whereOptions;
    const andClause: Prisma.Enumerable<Prisma.SteamAppWhereInput> = [];
    if (genreIds) {
      genreIds.forEach((id) => {
        andClause.push({
          genres: {
            some: {
              id,
            },
          },
        });
      });
    }
    if (categoryIds) {
      categoryIds.forEach((id) => {
        andClause.push({
          categories: {
            some: {
              id,
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
  return await prisma.steamApp.findMany({
    where: {
      name: {
        contains: appName,
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

export async function findSteamAppsWherePostsExist(): Promise<SteamAppForSmallAppsGridLayout[]> {
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
          id: true,
          description: true,
        },
      },
    },
  });
}
