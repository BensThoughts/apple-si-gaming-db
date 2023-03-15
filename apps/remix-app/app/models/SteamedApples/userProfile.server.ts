import type {
  PrismaUserProfile,
} from '~/interfaces/database';

import type {
  AppLoadContextSteamUser,
  PerformancePost,
} from '~/interfaces';

import prisma from '~/lib/database/db.server';
import type { UserSessionServerSide } from '~/interfaces/remix-app/UserSession';

export async function findUserSystemsBySteamUserId64(
    steamUserId64: PrismaUserProfile['steamUserId64'],
) {
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      steamUserId64,
    },
    select: {
      userSystemSpecs: {
        select: {
          id: true,
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
  return userProfile ? userProfile.userSystemSpecs : null;
}

export async function doesUserProfileExist(
    userProfileId: PrismaUserProfile['id'],
) {
  const userProfileCount = await prisma.userProfile.count({
    where: {
      id: userProfileId,
    },
  });
  return userProfileCount > 0 ? true : false;
}

export async function findUserSessionBySteamUserId64(
    steamUserId64: string,
): Promise<UserSessionServerSide | undefined> {
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      steamUserId64: BigInt(steamUserId64),
    },
    select: {
      id: true,
      userSystemSpecs: {
        select: {
          id: true,
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
      likedPerformancePosts: {
        select: {
          performancePostId: true,
        },
      },
      steamUserProfile: {
        select: {
          displayName: true,
          avatarFull: true,
          avatarMedium: true,
        },
      },
    },
  });
  if (!userProfile) {
    return undefined;
  }
  const {
    id,
    steamUserProfile,
    userSystemSpecs,
    likedPerformancePosts,
  } = userProfile;

  if (!steamUserProfile) {
    return undefined;
  }

  const likedPerformancePostIds = likedPerformancePosts.map(({ performancePostId }) => performancePostId);

  const systemSpecs = userSystemSpecs
      .map((systemSpec) => ({ ...systemSpec, systemSpecId: systemSpec.id }));

  const {
    displayName,
    avatarFull,
    avatarMedium,
  } = steamUserProfile;
  // const ownedSteamApps = new Map();
  // steamUserProfile.ownedSteamApps.forEach((steamApp) => ownedSteamApps.set(steamApp.steamAppId, steamApp));
  return {
    userSession: {
      userProfile: {
        userProfileId: id,
        likedPerformancePostIds,
        systemSpecs,
      },
      steamUserProfile: {
        // TODO: needs JSON.stringify? https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields
        steamUserId64: steamUserId64.toString(),
        displayName,
        avatarFull,
        avatarMedium,
      },
    },
  };
}

export async function findUserSessionByUserProfileId(
    userProfileId: PrismaUserProfile['id'],
): Promise<UserSessionServerSide | undefined> {
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      id: userProfileId,
    },
    select: {
      userSystemSpecs: {
        select: {
          id: true,
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
      likedPerformancePosts: {
        select: {
          performancePostId: true,
        },
      },
      steamUserProfile: {
        select: {
          steamUserId64: true,
          displayName: true,
          avatarFull: true,
          avatarMedium: true,
        },
      },
    },
  });
  if (!userProfile) {
    return undefined;
  }
  const {
    steamUserProfile,
    userSystemSpecs,
    likedPerformancePosts,
  } = userProfile;
  if (!steamUserProfile) {
    return undefined;
  }
  const likedPerformancePostIds = likedPerformancePosts.map(({ performancePostId }) => performancePostId);
  // const likedPerformancePostIds = new Map<number, number>();
  // likedPerformancePosts
  //     .forEach(({ performancePostId }) => likedPerformancePostIds.set(performancePostId, performancePostId));
  const systemSpecs = userSystemSpecs
      .map((systemSpec) => ({ ...systemSpec, systemSpecId: systemSpec.id }));
  const {
    steamUserId64,
    displayName,
    avatarFull,
    avatarMedium,
  } = steamUserProfile;
  // const ownedSteamApps = new Map();
  // steamUserProfile.ownedSteamApps.forEach((steamApp) => ownedSteamApps.set(steamApp.steamAppId, steamApp));
  return {
    userSession: {
      userProfile: {
        userProfileId,
        likedPerformancePostIds,
        systemSpecs,
      },
      steamUserProfile: {
        // TODO: needs JSON.stringify? https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields
        steamUserId64: steamUserId64.toString(),
        displayName,
        avatarFull,
        avatarMedium,
      },
    },
  };
}

export async function findUserProfileLikedPosts(
    userProfileId: number,
): Promise<Omit<PerformancePost, 'postTags' | 'systemSpec'>[]> {
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      id: userProfileId,
    },
    select: {
      likedPerformancePosts: {
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          performancePost: {
            select: {
              id: true,
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
                  steamAppId: true,
                  name: true,
                  headerImage: true,
                },
              },
              steamUserProfile: {
                select: {
                  steamUserId64: true,
                  displayName: true,
                  avatarMedium: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!userProfile) {
    return [];
  }
  const {
    likedPerformancePosts,
  } = userProfile;
  return likedPerformancePosts.map(({
    performancePost: {
      id,
      createdAt,
      _count: {
        usersWhoLiked,
      },
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
      postText,
      steamApp: {
        steamAppId,
        name,
        headerImage,
      },
      steamUserProfile: {
        steamUserId64,
        avatarMedium,
        displayName,
      },
    },
  }) => ({
    performancePostId: id,
    createdAt,
    numLikes: usersWhoLiked,
    rating: {
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
    },
    postText,
    steamApp: {
      steamAppId,
      name,
      headerImage,
    },
    userWhoCreated: {
      steamUserId64: steamUserId64.toString(),
      displayName,
      avatarMedium,
    },
  }));
}

export async function upsertUserProfileBySteamUserId64(
    steamUserId64: string,
    steamUserProfile: AppLoadContextSteamUser,
) {
  return prisma.userProfile.upsert({
    where: {
      steamUserId64: BigInt(steamUserId64),
    },
    create: {
      steamUserId64: BigInt(steamUserId64),
      steamUserProfile: {
        connectOrCreate: {
          where: {
            steamUserId64: BigInt(steamUserId64),
          },
          create: {
            ...steamUserProfile,
            steamUserId64: BigInt(steamUserId64),
          },
        },
      },
    },
    update: {
      steamUserProfile: {
        connectOrCreate: {
          where: {
            steamUserId64: BigInt(steamUserId64),
          },
          create: {
            ...steamUserProfile,
            steamUserId64: BigInt(steamUserId64),
          },
        },
      },
    },
    select: {
      id: true,
    },
  });
}

// export async function upsertSteamUser(
//     steamUser: Prisma.SteamUserCreateInput,
//     select?: Prisma.SteamUserSelect,
// ) {
//   return prisma.steamUser.upsert({
//     where: {
//       steamUserId: steamUser.steamUserId,
//     },
//     create: {
//       ...steamUser,
//     },
//     update: {
//       ...steamUser,
//     },
//     select,
//   });
// }
