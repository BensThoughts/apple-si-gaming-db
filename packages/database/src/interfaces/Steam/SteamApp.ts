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
    'categories' | 'genres'
  >
// Partial<Omit<SteamApp, 'id' | 'createdAt' | 'updatedAt'>> &
// Pick<SteamApp, 'steamAppId' | 'dataDownloaded' | 'dataDownloadAttempted' | 'name'>
& {
  categories?: Prisma.SteamCategoryCreateManyInput[] | null,
  genres?: Prisma.SteamGenreCreateManyInput[] | null,
};

export type SteamCategoryCreateManyInput =
  Prisma.SteamCategoryCreateManyInput;

export type SteamGenreCreateManyInput =
  Prisma.SteamGenreCreateManyInput;
