import type { PrismaSteamGenre } from '~/interfaces/database';

export type UserProfileBase = {
  userProfileId: number;
  likedPerformancePostIds: string[];
};

export type UserProfileSystemSpec = {
  systemSpecId: number;
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

export type SteamUserProfile = {
  steamUserId64: string;
  displayName?: string | null;
  avatarFull?: string | null;
  avatarMedium?: string | null;
}

export type OwnedSteamApp = {
  steamAppId: number;
  name: string;
  headerImage: string | null;
  platformMac: boolean | null;
  genres: PrismaSteamGenre[];
}
