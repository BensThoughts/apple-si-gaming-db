import type { AppLoadContext } from '@remix-run/server-runtime';
import type {
  AppLoadContextSteamUser,
  ExtendedAppLoadContext,
  PassportSteamUser,
} from '~/interfaces';
import type {
  Prisma,
} from '~/interfaces/database';

export function extractAppLoadContext(context: AppLoadContext): ExtendedAppLoadContext {
  const steamUser = context.steamUser ? context.steamUser as AppLoadContextSteamUser : null;
  return {
    steamUser,
  };
}

export function convertPassportSteamUserToPrismaSteamUser(
    passportSteamUser: PassportSteamUser,
): Omit<Prisma.SteamUserProfileCreateInput, 'steamUserId64'> &
  { steamUserId64: string } {
  // passport returns steamUserId64 as a string (steamid).
  // We convert this to bigint elsewhere to avoid throwing
  // in error in server.ts, where this function is used
  return {
    steamUserId64: passportSteamUser._json.steamid,
    avatar: passportSteamUser._json.avatar,
    avatarFull: passportSteamUser._json.avatarfull,
    avatarHash: passportSteamUser._json.avatarhash,
    avatarMedium: passportSteamUser._json.avatarmedium,
    commentPermission: passportSteamUser._json.commentpermission,
    communityVisibilityState: passportSteamUser._json.communityvisibilitystate,
    displayName: passportSteamUser.displayName,
    lastLogoff: passportSteamUser._json.lastlogoff,
    locCityId: passportSteamUser._json.loccityid,
    locCountryCode: passportSteamUser._json.loccountrycode,
    locStateCode: passportSteamUser._json.locstatecode,
    personaName: passportSteamUser._json.personaname,
    personaState: passportSteamUser._json.personastate,
    personaStateFlags: passportSteamUser._json.personastateflags,
    primaryClanId: passportSteamUser._json.primaryclanid,
    profileState: passportSteamUser._json.profilestate,
    profileUrl: passportSteamUser._json.profileurl,
    realName: passportSteamUser._json.realname,
    timeCreated: passportSteamUser._json.timecreated,
  };
}
