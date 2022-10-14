import type {
  Prisma,
  SteamApp,
  SteamUser,
} from '~/interfaces/database';

import type { PassportSteamUser } from '~/interfaces';

import prisma from '~/lib/database/db.server';
import { getSteamPlayerOwnedGamesRequest } from '@apple-si-gaming-db/steam-api';
import { searchAllAppsByAppIds } from './steamApp.server';

export async function findSteamUserSystemsByUserId(
    steamUserId: SteamUser['steamUserId'],
) {
  const steamUserSystems = await prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    select: {
      systemSpecs: {
        select: {
          systemName: true,
          manufacturer: true,
          model: true,
          osVersion: true,
          cpuBrand: true,
          videoDriver: true,
          videoDriverVersion: true,
          videoPrimaryVRAM: true,
          memoryRAM: true,
        },
      },
    },
  });
  return steamUserSystems ? steamUserSystems.systemSpecs : null;
}

export async function findSteamUserSystemNamesByUserId(
    steamUserId: SteamUser['steamUserId'],
) {
  const user = await prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    select: {
      systemSpecs: {
        select: {
          systemName: true,
        },
      },
    },
  });
  if (!user) return null;
  const { systemSpecs } = user;
  return systemSpecs.map((system) => system.systemName);
}


export function convertPassportSteamUserToPrismaSteamUser(
    passportSteamUser: PassportSteamUser,
): Prisma.SteamUserCreateInput {
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

export async function doesSteamUserExists(
    steamUserId: SteamUser['steamUserId'],
) {
  const steamUser = await prisma.steamUser.count({
    where: {
      steamUserId,
    },
  });
  return steamUser > 0 ? true : false;
}

export async function updateUserOwnedApps(
    steamUserId: SteamUser['steamUserId'],
) {
  const { games } = await getSteamPlayerOwnedGamesRequest(steamUserId);
  if (games) {
    const ownedAppIds = games.map((app) => app.appid);
    const ownedAppsInDB = await searchAllAppsByAppIds(ownedAppIds);
    const ownedAppIdsInDB = ownedAppsInDB.map((app) => app.steamAppId);
    await updateUserOwnedAppsInDatabase(ownedAppIdsInDB, steamUserId);
  }
}

export async function updateUserOwnedAppsInDatabase(
    steamAppIds: SteamApp['steamAppId'][],
    steamUserId: SteamUser['steamUserId'],
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
    steamUserId: SteamUser['steamUserId'],
    steamAppId: SteamApp['steamAppId'],
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

export async function findUserProfileData(steamUserId: SteamUser['steamUserId']) {
  return prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    include: {
      systemSpecs: {
        select: {
          systemName: true,
          manufacturer: true,
          model: true,
          osVersion: true,
          cpuBrand: true,
          videoDriver: true,
          videoDriverVersion: true,
          videoPrimaryVRAM: true,
          memoryRAM: true,
        },
        orderBy: {
          id: 'asc',
        },
      },
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

export async function upsertSteamUser(
    steamUser: Prisma.SteamUserCreateInput,
    select?: Prisma.SteamUserSelect,
) {
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
    select,
  });
}
