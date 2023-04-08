import type { SystemSpec } from './SystemSpec';

// Server side we get an array of liked post ids
// a map does not easily serialize.
export type UserSessionServerSide = {
  userSession?: {
    userProfile: {
      userProfileId: number;
      likedPerformancePostIds: number[];
      systemSpecs: SystemSpec[];
    };
    steamUserProfile: {
      steamUserId64: string;
      displayName?: string | null;
      avatarFull?: string | null;
      avatarMedium?: string | null;
    }
  }
}

// client side we turn the array of liked post ids into a Map for easy lookup
export type UserSessionClientSide = {
  userSession?: {
    userProfile: {
      userProfileId: number;
      likedPerformancePostIds: Map<number, number>;
      systemSpecs: SystemSpec[];
    };
    steamUserProfile: {
      steamUserId64: string;
      displayName?: string | null;
      avatarFull?: string | null;
      avatarMedium?: string | null;
    }
  }
}
