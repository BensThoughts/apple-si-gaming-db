import type { PrismaSteamUser } from '@apple-si-gaming-db/database';

export type ExtendedAppLoadContext = {
  'steamUser': PrismaSteamUser | null;
}
