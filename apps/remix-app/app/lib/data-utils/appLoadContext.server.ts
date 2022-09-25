import type { AppLoadContext } from '@remix-run/server-runtime';
import type { SteamUser } from '~/interfaces/database';
import type { ExtendedAppLoadContext } from '~/interfaces/AppLoadContext';

export function extractAppLoadContext(context: AppLoadContext): ExtendedAppLoadContext {
  const steamUser = context.steamUser ? context.steamUser as SteamUser : null;
  return {
    steamUser,
  };
}
