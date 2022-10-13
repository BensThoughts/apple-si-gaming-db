import type {
  SteamApp,
  SteamCategory,
  SteamGenre,
  Prisma,
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


export type SteamAppCreateInput =
  Omit<Prisma.SteamAppCreateInput,
    'demos' | 'priceOverview' | 'packageGroups' | 'categories' | 'genres' | 'screenshots' | 'movies' | 'achievements'
  >
// Partial<Omit<SteamApp, 'id' | 'createdAt' | 'updatedAt'>> &
// Pick<SteamApp, 'steamAppId' | 'dataDownloaded' | 'dataDownloadAttempted' | 'name'>
& {
  demos?: Prisma.SteamDemoCreateManySteamAppInput[] | null,
  priceOverview?: Prisma.SteamPriceOverviewCreateWithoutSteamAppInput | null,
  packageGroups?: SteamPackageGroupCreateManySteamAppInput[] | null,
  categories?: Prisma.SteamCategoryCreateManyInput[] | null,
  genres?: Prisma.SteamGenreCreateManyInput[] | null,
  screenshots?: Prisma.SteamScreenshotCreateManySteamAppInput[] | null,
  movies?: Prisma.SteamMovieCreateManySteamAppInput[] | null,
  achievements?: Prisma.SteamAchievementCreateManySteamAppInput[] | null,
};

export type SteamDemoCreateManySteamAppInput =
  Prisma.SteamDemoCreateManySteamAppInput;

export type SteamPriceOverviewCreateWithoutSteamAppInput =
  Prisma.SteamPriceOverviewCreateWithoutSteamAppInput;


export type SteamPackageGroupCreateManySteamAppInput =
  Omit<Prisma.SteamPackageGroupCreateManySteamAppInput, 'subs'>
    & {
      subs?: SteamPackageGroupSubCreateWithoutSteamPackageGroupInput[] | null;
    }

export type SteamPackageGroupSubCreateWithoutSteamPackageGroupInput =
  Prisma.SteamPackageGroupSubCreateWithoutSteamPackageGroupInput;

export type SteamCategoryCreateManyInput =
  Prisma.SteamCategoryCreateManyInput;

export type SteamGenreCreateManyInput =
  Prisma.SteamGenreCreateManyInput;

export type SteamScreenshotCreateManySteamAppInput =
  Prisma.SteamScreenshotCreateManySteamAppInput;

export type SteamMovieCreateManySteamAppInput =
  Prisma.SteamMovieCreateManySteamAppInput;

export type SteamAchievementCreateManySteamAppInput =
  Prisma.SteamAchievementCreateManySteamAppInput;
