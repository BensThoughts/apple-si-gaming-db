import type { SteamUser } from '@prisma/client';

export type PrismaSteamUser =
  Partial<Omit<SteamUser, 'id' | 'createdAt' | 'updatedAt'>> &
  Pick<SteamUser, 'steamUserId'>;
