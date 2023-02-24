import type {
  SteamCategoryCreateManyInput,
  SteamGenreCreateManyInput,
  SteamApp,
  SteamAppCreateInput,
} from '../interfaces';
import { prisma } from '../client';
import { logger } from '@apple-si-gaming-db/logger';
import type {
  Prisma,
} from '@prisma/client';

export async function updateSteamAppDownloadAttempted(
    steamAppId: SteamApp['steamAppId'],
    dataDownloadAttempted = true,
) {
  try {
    await prisma.steamApp.update({
      where: {
        steamAppId,
      },
      data: {
        dataDownloadAttempted,
        dataDownloadAttemptedAt: new Date(),
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error('Error in updateSteamAppDownloadAttempted');
      logger.error(err);
      // logError(err, appIdData);
      throw err;
    } else {
      throw err;
    }
  }
}


/**
 * * Sometimes the steam API returns data for another (related) appid
 * * We need to be careful to only update the app in the data,
 * * which may not be the appid we requested data on
 * @param  {PrismaSteamApp} prismaSteamAppData
 */
export async function updateSteamApp(
    // steamApiAppId: number,
    prismaSteamAppData: SteamAppCreateInput,
) {
  // const steamAppId = steamApiAppId;
  const {
    steamAppId,
    categories,
    genres,
    ...prismaSteamApp
  } = prismaSteamAppData;

  try {
    await prisma.steamApp.update({
      where: {
        steamAppId,
      },
      data: {
        ...prismaSteamApp,
        categories: connectOrCreateCategories(categories),
        genres: connectOrCreateGenres(genres),
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error('Error at prisma.steamApp.update in updateSteamApp');
      logger.error(err);
      // logError(err, appIdData);
      throw err;
    } else {
      throw err;
    }
  }
}

function connectOrCreateCategories(
    categories: SteamCategoryCreateManyInput[] | null | undefined,
): Prisma.SteamCategoryCreateNestedManyWithoutSteamAppsInput | undefined {
  return categories ? {
    connectOrCreate: categories.map((category) => {
      return {
        where: {
          id: category.id,
        },
        create: {
          id: category.id,
          description: category.description,
        },
      };
    }),
  } : undefined;
}

function connectOrCreateGenres(
    genres: SteamGenreCreateManyInput[] | null | undefined,
): Prisma.SteamGenreCreateNestedManyWithoutSteamAppsInput | undefined {
  return genres ? {
    connectOrCreate: genres.map((genre) => {
      return {
        where: {
          id: genre.id,
        },
        create: {
          id: genre.id,
          description: genre.description,
        },
      };
    }),
  } : undefined;
}
