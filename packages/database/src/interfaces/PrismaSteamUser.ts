import type { SteamUser } from '@prisma/client';

export { SteamUser };

export type SteamUserWithoutMetadata =
  Partial<Omit<SteamUser, 'id' | 'createdAt' | 'updatedAt'>> &
  Pick<SteamUser, 'steamUserId'>;
