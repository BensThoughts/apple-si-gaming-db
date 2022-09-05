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
} from './SteamApi';

export type {
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
