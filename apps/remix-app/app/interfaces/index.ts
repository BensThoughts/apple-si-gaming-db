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

export type SteamAppRating = 'Platinum' | 'Gold' | 'Silver' | 'Borked' | 'None';
