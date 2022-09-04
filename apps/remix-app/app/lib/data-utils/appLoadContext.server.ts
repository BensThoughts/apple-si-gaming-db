import type { AppLoadContext } from '@remix-run/server-runtime';
import type { PrismaSteamUser } from '~/interfaces';
import type { ExtendedAppLoadContext } from '~/interfaces/AppLoadContext';

export function extractAppLoadContext(context: AppLoadContext): ExtendedAppLoadContext {
  const steamUser = context.steamUser ? context.steamUser as PrismaSteamUser : null;
  return {
    steamUser,
  };
}
