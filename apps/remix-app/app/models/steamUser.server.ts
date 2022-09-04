import type { PrismaSteamUser } from '@apple-si-gaming-db/database';
import type { PassportSteamUser } from '~/interfaces';

import prisma from '~/lib/database/db.server';


export async function getUserBySteamId(steamUserId: PrismaSteamUser['steamUserId']) {
  return prisma.steamUser.findUnique({ where: { steamUserId } });
}

export async function createSteamUser(steamUser: PrismaSteamUser) {
  return prisma.steamUser.create({
    data: {
      ...steamUser,
    },
  });
}

export async function deleteUserBySteamId(steamUserId: PrismaSteamUser['steamUserId']) {
  return prisma.steamUser.delete({ where: { steamUserId } });
}

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

export async function updateUserOwnedApps(steamAppIds: number[], steamUserId: string) {
  return prisma.steamUser.update({
    where: {
      steamUserId,
    },
    data: {
      ownedApps: {
        connectOrCreate: steamAppIds.map((steamAppId) => ({
          where: {
            steamAppId,
          },
          create: {
            steamAppId,
            name: 'unknown',
          },
        })),
      },
    },
    select: {
      steamUserId: true,
      displayName: true,
      avatarFull: true,
      ownedApps: {
        select: {
          steamAppId: true,
          headerImage: true,
          name: true,
        },
      },
    },
  });
}

export async function upsertPassportSteamUserToPrisma(passportSteamUser: PassportSteamUser) {
  const prismaSteamUser = convertPassportSteamUserToPrismaSteamUser(passportSteamUser);
  return prisma.steamUser.upsert({
    where: {
      steamUserId: prismaSteamUser.steamUserId,
    },
    update: {
      ...prismaSteamUser,
    },
    create: {
      ...prismaSteamUser,
    },
  });
}

export async function upsertSteamUser(steamUser: PrismaSteamUser) {
  return prisma.steamUser.upsert({
    where: {
      steamUserId: steamUser.steamUserId,
    },
    create: {
      ...steamUser,
    },
    update: {
      ...steamUser,
    },
  });
}

