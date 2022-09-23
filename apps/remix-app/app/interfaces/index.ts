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

// export type SteamAppRatingMedal = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Borked' | 'None';

// export enum RatingMedal {
//   Platinum = 4,
//   Gold = 3,
//   Silver = 2,
//   Borked = 1,
// }
