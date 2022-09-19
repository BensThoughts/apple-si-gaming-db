import type {
  Prisma,
  SteamAppWithoutMetadata,
  SteamUserWithoutMetadata,
} from '~/interfaces/database';

import type { PassportSteamUser } from '~/interfaces';

import prisma from '~/lib/database/db.server';

import {
  findUserBySteamId,
  createSteamUser,
  deleteUserBySteamId,
  upsertSteamUser,
} from '@apple-si-gaming-db/database';

export {
  findUserBySteamId,
  createSteamUser,
  deleteUserBySteamId,
  upsertSteamUser,
};

export function convertPassportSteamUserToPrismaSteamUser(passportSteamUser: PassportSteamUser): SteamUserWithoutMetadata {
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

export async function updateUserOwnedApps(
    steamAppIds: SteamAppWithoutMetadata['steamAppId'][],
    steamUserId: SteamUserWithoutMetadata['steamUserId'],
) {
  return prisma.steamUser.update({
    where: {
      steamUserId,
    },
    data: {
      ownedApps: {
        connect: steamAppIds.map((steamAppId) => ({
          steamAppId,
        })),
      },
    },
  });
}

export async function doesSteamUserOwnApp(
    steamUserId: SteamUserWithoutMetadata['steamUserId'],
    steamAppId: SteamAppWithoutMetadata['steamAppId'],
) {
  const steamUser = await prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    select: {
      ownedApps: {
        where: {
          steamAppId,
        },
        select: {
          steamAppId: true,
        },
      },
    },
  });
  if (!steamUser) {
    return false;
  }
  return steamUser.ownedApps.map((app) => app.steamAppId).includes(steamAppId);
}

export async function findUserOwnedApps(steamUserId: SteamUserWithoutMetadata['steamUserId']) {
  return prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    include: {
      ownedApps: {
        where: {
          comingSoon: {
            equals: false,
          },
          type: {
            contains: 'game',
            mode: 'insensitive',
          },
        },
        select: {
          steamAppId: true,
          name: true,
          headerImage: true,
          platformMac: true,
          genres: true,
          // categories: true,
        },
      },
    },
  });
}
