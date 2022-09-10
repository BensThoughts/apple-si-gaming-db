import type { SteamUserWithoutMetadata } from '@apple-si-gaming-db/database';

export type ExtendedAppLoadContext = {
  'steamUser': SteamUserWithoutMetadata | null;
}
