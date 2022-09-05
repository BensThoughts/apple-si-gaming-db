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

/*
 * Just the data without PostgreSql metadata and the option to omit (have
 * undefined) some properties for when we 'select' only some properties in a
 * find operation.
 */

export type PrismaSteamApp =
  Partial<Omit<SteamApp, 'updatedAt' | 'createdAt' | 'id'>> &
  Pick<SteamApp, 'steamAppId' | 'dataDownloaded' | 'dataDownloadAttempted' | 'name'> & {
    demos?: PrismaSteamDemo[] | null,
    priceOverview?: PrismaSteamPriceOverview | null,
    packageGroups?: PrismaSteamPackageGroup[] | null,
    categories?: PrismaSteamCategory[] | null,
    genres?: PrismaSteamGenre[] | null,
    screenshots?: PrismaSteamScreenshot[] | null,
    movies?: PrismaSteamMovie[] | null,
    achievements?: PrismaSteamAchievement[] | null,
  };

export type PrismaSteamDemo =
  Partial<Omit<SteamDemo, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamDemo, 'steamAppId' | 'demoAppId'>

export type PrismaSteamPriceOverview =
  Partial<Omit<SteamPriceOverview, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamPriceOverview, 'steamAppId'>;

export type PrismaSteamPackageGroup =
  Partial<Omit<SteamPackageGroup, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamPackageGroup, 'steamAppId' | 'name' > & {
    subs?: PrismaSteamPackageGroupSub[] | null;
  }

export type PrismaSteamPackageGroupSub =
  Partial<Omit<SteamPackageGroupSub, 'id' | 'createdAt' | 'updatedAt' | 'steamPackageGroup'>> &
  Pick<SteamPackageGroupSub, 'steamAppId' | 'packageId' | 'packageGroupName' >

export type PrismaSteamCategory =
  Omit<SteamCategory, 'id' | 'createdAt' | 'updatedAt' | 'steamApps'>

export type PrismaSteamGenre =
  Omit<SteamGenre, 'id' | 'createdAt' | 'updatedAt' | 'steamApps'>

export type PrismaSteamScreenshot =
  Partial<Omit<SteamScreenshot, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamScreenshot, 'steamAppId' | 'screenshotId'>;

export type PrismaSteamMovie =
  Partial<Omit<SteamMovie, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamMovie, 'steamAppId' | 'movieId'>;

export type PrismaSteamAchievement =
  Partial<Omit<SteamAchievement, 'id' | 'createdAt' | 'updatedAt' | 'steamApp'>> &
  Pick<SteamAchievement, 'steamAppId' | 'name'>;
