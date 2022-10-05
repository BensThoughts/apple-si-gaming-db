import type { AppLoadContext } from '@remix-run/server-runtime';
import type { AppLoadContextSteamUser, ExtendedAppLoadContext } from '~/interfaces/AppLoadContext';

export function extractAppLoadContext(context: AppLoadContext): ExtendedAppLoadContext {
  const steamUser = context.steamUser ? context.steamUser as AppLoadContextSteamUser : null;
  return {
    steamUser,
  };
}
