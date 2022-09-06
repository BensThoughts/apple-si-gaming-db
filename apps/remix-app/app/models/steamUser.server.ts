import type { PassportSteamUser, PrismaSteamUser, Prisma } from '~/interfaces';

import {
  findUserBySteamId,
  createSteamUser,
  deleteUserBySteamId,
  updateUserOwnedApps,
  upsertSteamUser,
} from '@apple-si-gaming-db/database';

export {
  findUserBySteamId,
  createSteamUser,
  deleteUserBySteamId,
  updateUserOwnedApps,
  upsertSteamUser,
};

export function convertPassportSteamUserToPrismaSteamUser(passportSteamUser: PassportSteamUser): PrismaSteamUser {
  return {
    steamUserId: passportSteamUser._json.steamid,
    displayName: passportSteamUser.displayName,
    communityVisibilityState: passportSteamUser._json.communityvisibilitystate,
    profileState: passportSteamUser._json.profilestate,
    personaName: passportSteamUser._json.personaname,
    commentPermission: passportSteamUser._json.commentpermission,
    profileUrl: passportSteamUser._json.profileurl,
    avatar: passportSteamUser._json.avatar,
    avatarMedium: passportSteamUser._json.avatarmedium,
    avatarFull: passportSteamUser._json.avatarfull,
    avatarHash: passportSteamUser._json.avatarhash,
    lastLogoff: passportSteamUser._json.lastlogoff,
    personaState: passportSteamUser._json.personastate,
    realName: passportSteamUser._json.realname,
    primaryClanId: passportSteamUser._json.primaryclanid,
    timeCreated: passportSteamUser._json.timecreated,
    personaStateFlags: passportSteamUser._json.personastateflags,
    locCountryCode: passportSteamUser._json.loccountrycode,
    locStateCode: passportSteamUser._json.locstatecode,
    locCityId: passportSteamUser._json.loccityid,
  };
}

export async function upsertPassportSteamUserToPrisma(
    passportSteamUser: PassportSteamUser,
    select: Prisma.SteamUserSelect,
) {
  const prismaSteamUser = convertPassportSteamUserToPrismaSteamUser(passportSteamUser);
  return upsertSteamUser(prismaSteamUser, select);
}
