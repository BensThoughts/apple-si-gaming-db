import type { Logger } from 'winston';

export type LoggerMetadata = {
  metadata?: {
    steamApp?: {
      steamAppId: number;
      name?: string;
    }
    userSession?: {
      userProfile?: {
        userProfileId: number;
      }
      steamUserProfile?: {
        steamUserId64: string;
      }
    }
    extra?: any;
  }
}

export interface ExtendedLeveledLogMethod {
  (message: string, metadata?: LoggerMetadata & { error?: Error }): Logger;
  // (message: string, callback: LogCallback): Logger;
  // (message: string, meta: any, callback: LogCallback): Logger;
  // (message: string, ...meta: any[]): Logger;
  (message: any): Logger;
  (infoObject: object): Logger;
}
