
// Server side we get an array of liked post ids
// a map does not easily serialize.
export type UserSessionServerSide = {
  userProfile?: {
    userProfileId: number;
    likedPerformancePostIds: number[];
    systemSpecs: UserProfileSystemSpec[];
  };
  steamUserProfile?: {
    steamUserId64: string;
    displayName?: string | null;
    avatarFull?: string | null;
    avatarMedium?: string | null;
  }
}

// client side we turn the array of liked post ids into a Map for easy lookup
export type UserSession = {
  userProfile?: {
    userProfileId: number;
    likedPerformancePostIds: Map<number, number>;
    systemSpecs: UserProfileSystemSpec[];
  };
  steamUserProfile?: {
    steamUserId64: string;
    displayName?: string | null;
    avatarFull?: string | null;
    avatarMedium?: string | null;
  }
}

export type UserProfileSystemSpec = {
  systemSpecId: number; // id in database
  systemName: string;
  manufacturer: string | null;
  model: string | null;
  cpuBrand: string | null;
  osVersion: string | null;
  videoDriver: string | null;
  videoDriverVersion: string | null;
  videoPrimaryVRAM: string | null;
  memoryRAM: string | null;
}
