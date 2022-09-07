export type {
  SteamApiAppDetailsResponse,
  SteamApiAppData,
  SteamApiDemo,
  SteamApiPriceOverview,
  SteamApiPackageGroup,
  SteamApiPackageGroupSub,
  SteamApiCategory,
  SteamApiGenre,
  SteamApiScreenshotData,
  SteamApiMovieData,
  SteamApiAchievement,

  SteamApiGetOwnedGamesResponse,
} from '@apple-si-gaming-db/steam-api';

export type {
  Prisma,
  PrismaSteamApp,
  PrismaSteamDemo,
  PrismaSteamPriceOverview,
  PrismaSteamPackageGroup,
  PrismaSteamPackageGroupSub,
  PrismaSteamCategory,
  PrismaSteamGenre,
  PrismaSteamScreenshot,
  PrismaSteamMovie,
  PrismaSteamAchievement,

  PrismaSteamUser,
  PrismaPerformancePost,
} from '@apple-si-gaming-db/database';

export type {
  PassportSteamUser,
} from './PassportSteamUser';

export type {
  ExtendedAppLoadContext,
} from './AppLoadContext';

export interface AppIdData {
  steamAppId: number;
  appName?: string;
  index?: number;
  steamId?: string;
}
