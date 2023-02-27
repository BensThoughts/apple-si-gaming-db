import type {
  PrismaUserProfile,
} from '~/interfaces/database';

import type { AppLoadContextSteamUser } from '~/interfaces';

import prisma from '~/lib/database/db.server';
import type { UserProfileForRootLoaderData } from '~/root';

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

export async function findUserProfileData(
    userProfileId: PrismaUserProfile['id'],
): Promise<UserProfileForRootLoaderData | undefined> {
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
          ownedSteamApps: {
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
        },
      },
    },
  });
  if (!userProfile) {
    return undefined;
  }
  const {
    steamUserProfile,
  } = userProfile;
  if (!steamUserProfile) {
    return undefined;
  }
  const {
    steamUserId64,
    displayName,
    avatarFull,
    avatarMedium,
    ownedSteamApps,
  } = steamUserProfile;
  // const ownedSteamApps = userProfile.steamUserProfile ? userProfile.steamUserProfile.ownedSteamApps : [];
  return {
    userProfileId,
    steamUserProfile: {
      // TODO: needs JSON.stringify? https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields
      displayName,
      avatarFull,
      avatarMedium,
      steamUserId64: steamUserId64.toString(),
      ownedSteamApps,
    },
    likedPerformancePostIds: userProfile.likedPerformancePosts
        .map((performancePost) => performancePost.performancePostId),
    systemSpecs: userProfile.userSystemSpecs
        .map((systemSpec) => ({
          ...systemSpec,
          systemSpecId: systemSpec.id,
        })),
  };
}

export async function findUserProfileLikedPosts(
    userProfileId: number,
) {
  return prisma.userProfile.findUnique({
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
            },
          },
        },
      },
    },
  });
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
      steamUserId64: true,
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
