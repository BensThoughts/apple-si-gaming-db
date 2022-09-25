import type { SteamUserSystemSpecs } from '@prisma/client';
export { SteamUserSystemSpecs };

export type SteamUserSystemSpecsWithoutMetadata =
  Partial<Omit<SteamUserSystemSpecs, 'id' | 'createdAt' | 'updatedAt'>> &
  Pick<SteamUserSystemSpecs, 'steamUserId' | 'systemName'>;


