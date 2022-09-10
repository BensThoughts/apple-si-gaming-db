import type {
  SteamApp,
  SteamPriceOverview,
  SteamCategory,
  SteamGenre,
  SteamScreenshot,
  SteamMovie,
  SteamAchievement,
  SteamDemo,
  SteamPackageGroup,
  SteamPackageGroupSub,
} from '@prisma/client';

export {
  SteamApp,
  SteamCategory,
  SteamGenre,
};

/*
 * Just the data without PostgreSql metadata and the option to omit (have
 * undefined) some properties for when we 'select' only some properties in a
 * find operation.
 */

export type SteamAppWithoutMetadata =
  Partial<Omit<SteamApp, 'id' | 'createdAt' | 'updatedAt'>> &
  Pick<SteamApp, 'steamAppId' | 'dataDownloaded' | 'dataDownloadAttempted' | 'name'> & {
    demos?: SteamDemoWithoutMetadata[] | null,
    priceOverview?: SteamPriceOverviewWithoutMetadata | null,
    packageGroups?: SteamPackageGroupWithoutMetadata[] | null,
    categories?: SteamCategoryWithoutMetadata[] | null,
    genres?: SteamGenreWithoutMetadata[] | null,
    screenshots?: SteamScreenshotWithoutMetadata[] | null,
    movies?: SteamMovieWithoutMetadata[] | null,
    achievements?: SteamAchievementWithoutMetadata[] | null,
  };

export type SteamDemoWithoutMetadata =
  Partial<Omit<SteamDemo, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamDemo, 'steamAppId' | 'demoAppId'>

export type SteamPriceOverviewWithoutMetadata =
  Partial<Omit<SteamPriceOverview, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamPriceOverview, 'steamAppId'>;

export type SteamPackageGroupWithoutMetadata =
  Partial<Omit<SteamPackageGroup, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamPackageGroup, 'steamAppId' | 'name' > & {
    subs?: SteamPackageGroupSubWithoutMetadata[] | null;
  }

export type SteamPackageGroupSubWithoutMetadata =
  Partial<Omit<SteamPackageGroupSub, 'id' | 'createdAt' | 'updatedAt' | 'steamPackageGroup'>> &
  Pick<SteamPackageGroupSub, 'steamAppId' | 'packageId' | 'packageGroupName' >

export type SteamCategoryWithoutMetadata =
  Omit<SteamCategory, 'id' | 'createdAt' | 'updatedAt' | 'steamApps'>

export type SteamGenreWithoutMetadata =
  Omit<SteamGenre, 'id' | 'createdAt' | 'updatedAt' | 'steamApps'>

export type SteamScreenshotWithoutMetadata =
  Partial<Omit<SteamScreenshot, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamScreenshot, 'steamAppId' | 'screenshotId'>;

export type SteamMovieWithoutMetadata =
  Partial<Omit<SteamMovie, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamMovie, 'steamAppId' | 'movieId'>;

export type SteamAchievementWithoutMetadata =
  Partial<Omit<SteamAchievement, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamAchievement, 'steamAppId' | 'name'>;
