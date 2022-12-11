import type {
  Prisma,
  SteamApp,
  SteamUser,
} from '~/interfaces/database';

import type { PassportSteamUser } from '~/interfaces';

import prisma from '~/lib/database/db.server';
import { getSteamPlayerOwnedGamesRequest } from '@apple-si-gaming-db/steam-api';
import { filterAppIdsExistInDatabase } from './steamApp.server';

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
          cpuBrand: true,
          manufacturer: true,
          memoryRAM: true,
          model: true,
          osVersion: true,
          systemName: true,
          videoDriver: true,
          videoDriverVersion: true,
          videoPrimaryVRAM: true,
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

export async function doesSteamUserExist(
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
    const ownedAppIdsInDB = await filterAppIdsExistInDatabase(ownedAppIds);
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
  // const testCount = await prisma.steamUser.count({
  //   where: {
  //     steamUserId,
  //     ownedApps: {
  //       some: {
  //         steamAppId,
  //       },
  //     },
  //   },
  // });
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
    select: {
      likedPerformancePosts: {
        select: {
          performancePostId: true,
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
        orderBy: {
          name: 'asc',
        },
        select: {
          steamAppId: true,
          genres: true,
          headerImage: true,
          name: true,
          platformMac: true,
        },
      },
      systemSpecs: {
        select: {
          cpuBrand: true,
          manufacturer: true,
          memoryRAM: true,
          model: true,
          osVersion: true,
          systemName: true,
          videoDriver: true,
          videoDriverVersion: true,
          videoPrimaryVRAM: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
}

export async function findSteamUsersPerformancePosts(
    steamUserId: SteamUser['steamUserId'],
) {
  return prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    select: {
      PerformancePosts: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          steamAppId: true,
          createdAt: true,
          _count: {
            select: {
              usersWhoLiked: true,
            },
          },
          frameRateAverage: true,
          frameRateStutters: true,
          postText: true,
          ratingMedal: true,
          steamApp: {
            select: {
              headerImage: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function findSteamUserLikedPosts(
    steamUserId: string,
) {
  return prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    select: {
      likedPerformancePosts: {
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          steamPerformancePost: {
            select: {
              id: true,
              steamAppId: true,
              createdAt: true,
              _count: {
                select: {
                  usersWhoLiked: true,
                },
              },
              frameRateAverage: true,
              frameRateStutters: true,
              postText: true,
              ratingMedal: true,
              steamApp: {
                select: {
                  name: true,
                  headerImage: true,
                },
              },
            },
          },
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
