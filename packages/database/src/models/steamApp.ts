import type {
  PrismaSteamDemo,
  PrismaSteamPriceOverview,
  PrismaSteamPackageGroupSub,
  PrismaSteamCategory,
  PrismaSteamGenre,
  PrismaSteamScreenshot,
  PrismaSteamMovie,
  PrismaSteamAchievement,
  PrismaSteamApp,
} from '../interfaces';
import { prisma } from '../client';
import logger from '@apple-si-gaming-db/logger';

function valueExistsOrNull<T>(v: T) {
  if (v === null || v === undefined) {
    return null;
  }
  return v;
}

export async function updateSteamAppDownloadAttempted(
    steamAppId: PrismaSteamApp['steamAppId'],
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
      // const error = new Error('Error in updateSteamAppDownloadAttempted',{
      //   cause: err,
      // });
      throw err;
      // logError(err, appIdData);
    } else {
      throw err;
    }
  }
}

export async function updateSteamApp(
    prismaSteamAppData: PrismaSteamApp,
) {
  const {
    steamAppId,
    demos,
    priceOverview,
    packageGroups,
    categories,
    genres,
    screenshots,
    movies,
    achievements,
    ...prismaSteamApp
  } = prismaSteamAppData;

  try {
    await prisma.steamApp.update({
      where: {
        steamAppId,
      },
      data: {
        ...prismaSteamApp,
        demos: connectOrCreateDemos(steamAppId, demos),
        priceOverview: connectOrCreatePriceOverview(steamAppId, priceOverview),
        categories: connectOrCreateCategories(categories),
        genres: connectOrCreateGenres(genres),
        screenshots: connectOrCreateScreenshots(steamAppId, screenshots),
        movies: connectOrCreateMovies(steamAppId, movies),
        achievements: connectOrCreateAchievements(steamAppId, achievements),
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error('Error at prisma.steamApp.update in updateSteamApp');
      // const error = new Error('Error at prisma.steamApp.update in updateSteamApp', {
      //   cause: err,
      // });
      throw err;
      // logError(err, appIdData);
    } else {
      throw err;
    }
  }

  if (packageGroups) {
    for (let i = 0; i < packageGroups.length; i++) {
      const packageGroup = packageGroups[i];

      try {
        await prisma.steamPackageGroup.upsert({
          where: {
            steamAppId_name: {
              steamAppId,
              name: packageGroup.name,
            },
          },
          create: {
            steamAppId,
            name: packageGroup.name,
            title: valueExistsOrNull(packageGroup.title),
            description: valueExistsOrNull(packageGroup.description),
            selectionText: valueExistsOrNull(packageGroup.selectionText),
            saveText: valueExistsOrNull(packageGroup.saveText),
            displayType: valueExistsOrNull(packageGroup.displayType),
            isRecurringSubscription: valueExistsOrNull(packageGroup.isRecurringSubscription),
            subs: connectOrCreatePackageGroupSubs(steamAppId, packageGroup.subs),
          },
          update: {
            steamAppId,
            name: packageGroup.name,
            title: valueExistsOrNull(packageGroup.title),
            description: valueExistsOrNull(packageGroup.description),
            selectionText: valueExistsOrNull(packageGroup.selectionText),
            saveText: valueExistsOrNull(packageGroup.saveText),
            displayType: valueExistsOrNull(packageGroup.displayType),
            isRecurringSubscription: valueExistsOrNull(packageGroup.isRecurringSubscription),
            subs: connectOrCreatePackageGroupSubs(steamAppId, packageGroup.subs),
          },
        });
      } catch (err) {
        if (err instanceof Error) {
          logger.error('Error at prisma.steamPackageGroup.upsert in updateSteamApp');
          // const error = new Error('Error at prisma.steamPackageGroup.upsert in updateSteamApp', {
          //   cause: err,
          // });
          throw err;
          // logError(err, appIdData);
        } else {
          throw err;
        }
      }
    }
  }
}

function connectOrCreateDemos(
    steamAppId: number,
    demos: PrismaSteamDemo[] | null | undefined,
) {
  return demos ? {
    connectOrCreate: demos.map((demo) => {
      return {
        where: {
          steamAppId_demoAppId: {
            steamAppId,
            demoAppId: demo.demoAppId,
          },
        },
        create: {
          demoAppId: demo.demoAppId,
          description: valueExistsOrNull(demo.description),
        },
      };
    }),
  } : undefined;
}

function connectOrCreatePriceOverview(
    steamAppId: number,
    priceOverview: PrismaSteamPriceOverview | null | undefined,
) {
  return priceOverview ? {
    connectOrCreate: {
      where: {
        steamAppId,
      },
      create: {
        currency: valueExistsOrNull(priceOverview.currency),
        initial: valueExistsOrNull(priceOverview.initial),
        final: valueExistsOrNull(priceOverview.final),
        discountPercent: valueExistsOrNull(priceOverview.discountPercent),
        initialFormatted: valueExistsOrNull(priceOverview.initialFormatted),
        finalFormatted: valueExistsOrNull(priceOverview.finalFormatted),
      },
    },
  } : undefined;
}

function connectOrCreatePackageGroupSubs(
    steamAppId: number,
    subs: PrismaSteamPackageGroupSub[] | null | undefined,
) {
  return subs ? {
    connectOrCreate: subs.map((sub) => {
      return {
        where: {
          steamAppId_packageGroupName_packageId: {
            steamAppId,
            packageGroupName: sub.packageGroupName,
            packageId: sub.packageId,
          },
        },
        create: {
          packageId: sub.packageId,
          percentSavingsText: valueExistsOrNull(sub.percentSavingsText),
          percentSavings: valueExistsOrNull(sub.percentSavings),
          optionText: valueExistsOrNull(sub.optionText),
          optionDescription: valueExistsOrNull(sub.optionDescription),
          canGetFreeLicense: valueExistsOrNull(sub.canGetFreeLicense),
          isFreeLicense: valueExistsOrNull(sub.isFreeLicense),
          priceInCentsWithDiscount: valueExistsOrNull(sub.priceInCentsWithDiscount),
        },
      };
    }),
  } : undefined;
}

function connectOrCreateCategories(categories: PrismaSteamCategory[] | null | undefined) {
  return categories ? {
    connectOrCreate: categories.map((category) => {
      return {
        where: {
          categoryId: category.categoryId,
        },
        create: {
          categoryId: category.categoryId,
          description: category.description,
        },
      };
    }),
  } : undefined;
}

function connectOrCreateGenres(genres: PrismaSteamGenre[] | null | undefined) {
  return genres ? {
    connectOrCreate: genres.map((genre) => {
      return {
        where: {
          genreId: genre.genreId,
        },
        create: {
          genreId: genre.genreId,
          description: genre.description,
        },
      };
    }),
  } : undefined;
}

function connectOrCreateScreenshots(
    steamAppId: number,
    screenshots: PrismaSteamScreenshot[] | null | undefined,
) {
  return screenshots ? {
    connectOrCreate: screenshots.map((screenshot) => {
      return {
        where: {
          steamAppId_screenshotId: {
            steamAppId,
            screenshotId: screenshot.screenshotId,
          },
        },
        create: {
          screenshotId: screenshot.screenshotId,
          pathThumbnail: valueExistsOrNull(screenshot.pathThumbnail),
          pathFull: valueExistsOrNull(screenshot.pathFull),
        },
      };
    }),
  } : undefined;
}

function connectOrCreateMovies(
    steamAppId: number,
    movies: PrismaSteamMovie[] | null | undefined,
) {
  return movies ? {
    connectOrCreate: movies.map((movie) => {
      return {
        where: {
          steamAppId_movieId: {
            steamAppId,
            movieId: movie.movieId,
          },
        },
        create: {
          movieId: movie.movieId,
          name: valueExistsOrNull(movie.name),
          thumbnail: valueExistsOrNull(movie.thumbnail),
          webmFourEighty: valueExistsOrNull(movie.webmFourEighty),
          webmMax: valueExistsOrNull(movie.webmMax),
          mp4FourEighty: valueExistsOrNull(movie.mp4FourEighty),
          mp4Max: valueExistsOrNull(movie.mp4Max),
          highlight: valueExistsOrNull(movie.highlight),
        },
      };
    }),
  } : undefined;
}

function connectOrCreateAchievements(
    steamAppId: number,
    achievements: PrismaSteamAchievement[] | null | undefined,
) {
  return achievements ? {
    connectOrCreate: achievements.map((achievement) => {
      return {
        where: {
          steamAppId_name: {
            steamAppId,
            name: achievement.name,
          },
        },
        create: {
          name: achievement.name,
          path: valueExistsOrNull(achievement.path),
          highlighted: valueExistsOrNull(achievement.highlighted),
        },
      };
    }),
  }: undefined;
}
