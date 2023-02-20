import type {
  PrismaSteamPerformancePost,
  PrismaSteamApp,
  PrismaSteamUser,
  PrismaSteamUserSystemSpecs,
  FrameRate,
  PrismaPostTag,
  Prisma,
  PrismaGamepadMetadata,
  GamepadRating,
} from '~/interfaces/database';
import prisma from '~/lib/database/db.server';
import { findUniqueSystemSpecForPost } from './steamUserSystemSpecs.server';


export async function createPerformancePost({
  steamUserId,
  displayName,
  avatarMedium,
  steamAppId,
  postText,
  frameRateAverage,
  frameRateStutters,
  ratingMedal,
  systemName,
  postTagIds,
  gamepadId,
  gamepadRating,
}: {
  steamUserId: PrismaSteamUser['steamUserId'];
  steamAppId: PrismaSteamApp['steamAppId'];
  postText: PrismaSteamPerformancePost['postText'];
  frameRateAverage?: FrameRate;
  frameRateStutters: boolean;
  ratingMedal: PrismaSteamPerformancePost['ratingMedal'];
  avatarMedium?: PrismaSteamPerformancePost['avatarMedium'];
  displayName?: PrismaSteamPerformancePost['displayName'];
  systemName: PrismaSteamUserSystemSpecs['systemName'];
  postTagIds: PrismaPostTag['postTagId'][];
  gamepadId?: PrismaGamepadMetadata['gamepadId'];
  gamepadRating?: GamepadRating;
}) {
  const performancePostData: Prisma.SteamPerformancePostCreateInput = {
    steamApp: {
      connect: {
        steamAppId,
      },
    },
    steamUserId,
    displayName,
    avatarMedium,
    postText,
    frameRateAverage,
    frameRateStutters,
    ratingMedal,
    gamepadMetadata: gamepadId ? {
      connect: {
        gamepadId,
      },
    } : undefined,
    gamepadRating,
    postTags: {
      connect: postTagIds.map((postTagId) => ({
        postTagId,
      })),
    },
    // TODO: Decide if we should use explicit vs. implicit
    // ! WITH JOIN TABLE
    // postTags: postTagIds.length > 0 ? {
    //   create: postTagIds.map((postTagId) => ({
    //     postTag: {
    //       connect: {
    //         id: postTagId,
    //       },
    //     },
    //   })),
    // } : undefined,
  };

  const systemSpecs = await findUniqueSystemSpecForPost(steamUserId, systemName);
  // TODO: Rather than throwing an error, maybe just let it pass
  // !Removed to allow no system specs on a performance post
  // if (!systemSpecs) {
  //   throw new Error(`System ${systemName} was not found in the database.`);
  // }

  // !Added to allow no system specs on performance posts
  if (!systemSpecs) {
    return prisma.steamPerformancePost.create({ data: performancePostData });
  }
  return prisma.steamPerformancePost.create({
    data: {
      ...performancePostData,
      systemManufacturer: systemSpecs.manufacturer,
      systemModel: systemSpecs.model,
      systemOsVersion: systemSpecs.osVersion,
      systemCpuBrand: systemSpecs.cpuBrand,
      systemVideoDriver: systemSpecs.videoDriver,
      systemVideoDriverVersion: systemSpecs.videoDriverVersion,
      systemVideoPrimaryVRAM: systemSpecs.videoPrimaryVRAM,
      systemMemoryRAM: systemSpecs.memoryRAM,
    },
  });
};

export async function likePost(
    postId: string,
    steamUserId: string,
) {
  return prisma.steamPerformancePost.update({
    where: {
      id: postId,
    },
    data: {
      usersWhoLiked: {
        upsert: {
          where: {
            steamUserId_performancePostId: {
              steamUserId,
              performancePostId: postId,
            },
          },
          update: {
            steamUserId,
          },
          create: {
            steamUserId,
          },
        },
      },
    },
  });
}

export async function unlikePost(
    postId: string,
    steamUserId: string,
) {
  return prisma.steamPerformancePost.update({
    where: {
      id: postId,
    },
    data: {
      usersWhoLiked: {
        deleteMany: {
          AND: {
            steamUserId,
            performancePostId: postId,
          },
          // steamUserId_performancePostId: {
          //   steamUserId,
          //   performancePostId: postId,
          // },
        },
      },
    },
  });
}

export async function findPerformancePostsBySteamAppId(
    steamAppId: PrismaSteamApp['steamAppId'],
) {
  return prisma.steamPerformancePost.findMany({
    where: {
      steamAppId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      _count: {
        select: {
          usersWhoLiked: true,
        },
      },
      id: true,
      createdAt: true,
      avatarMedium: true,
      displayName: true,
      frameRateAverage: true,
      frameRateStutters: true,
      gamepadMetadata: {
        select: {
          gamepadId: true,
          description: true,
        },
      },
      gamepadRating: true,
      postText: true,
      postTags: {
        select: {
          postTagId: true,
          description: true,
        },
      },
      ratingMedal: true,
      steamApp: {
        select: {
          name: true,
          steamAppId: true,
        },
      },
      steamUserId: true,
      systemManufacturer: true,
      systemModel: true,
      systemOsVersion: true,
      systemCpuBrand: true,
      systemVideoDriver: true,
      systemVideoDriverVersion: true,
      systemVideoPrimaryVRAM: true,
      systemMemoryRAM: true,
    },
  });
}

export async function findPerformancePostsBySteamUserId(
    steamUserId: string,
) {
  return prisma.steamPerformancePost.findMany({
    where: {
      steamUserId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      createdAt: true,
      postText: true,
      _count: {
        select: {
          usersWhoLiked: true,
        },
      },
      frameRateAverage: true,
      frameRateStutters: true,
      ratingMedal: true,
      steamApp: {
        select: {
          steamAppId: true,
          headerImage: true,
          name: true,
        },
      },
    },
  });
}


export async function findNewestPerformancePosts(
    numPerformancePosts: number,
) {
  return prisma.steamPerformancePost.findMany({
    select: {
      id: true,
      createdAt: true,
      steamApp: {
        select: {
          steamAppId: true,
          name: true,
        },
      },
      ratingMedal: true,
      postText: true,
      steamUserId: true,
      displayName: true,
      avatarMedium: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: numPerformancePosts,
  });
}

export async function didCurrentSessionUserCreatePost(
    steamUserId: string,
    postId: string,
) {
  const steamUserIdThatCreatedPost = await prisma.steamPerformancePost.findUnique({
    where: {
      id: postId,
    },
    select: {
      steamUserId: true,
    },
  });
  if (
    steamUserIdThatCreatedPost &&
    (
      steamUserIdThatCreatedPost.steamUserId === steamUserId
    )
  ) {
    return true;
  }
  return false;
}

export async function deletePerformancePost(postId: PrismaSteamPerformancePost['id']) {
  return prisma.steamPerformancePost.delete({
    where: {
      id: postId,
    },
  });
}

export async function updatePerformancePost({
  steamUserId,
  postId,
  postText,
  frameRateAverage,
  frameRateStutters,
  ratingMedal,
  systemName,
  postTagIds,
  gamepadId,
  gamepadRating,
}: {
  steamUserId: PrismaSteamPerformancePost['steamUserId'];
  postId: PrismaSteamPerformancePost['id'];
  postText: PrismaSteamPerformancePost['postText'];
  frameRateAverage?: FrameRate;
  frameRateStutters: boolean;
  ratingMedal: PrismaSteamPerformancePost['ratingMedal'];
  systemName: PrismaSteamUserSystemSpecs['systemName'];
  postTagIds: PrismaPostTag['postTagId'][];
  gamepadId?: PrismaGamepadMetadata['gamepadId'];
  gamepadRating?: GamepadRating;
}) {
  const performancePostData: Prisma.SteamPerformancePostUpdateInput = {
    postText,
    frameRateAverage,
    frameRateStutters,
    ratingMedal,
    gamepadMetadata: gamepadId ? {
      connect: {
        gamepadId,
      },
    } : undefined,
    gamepadRating,
    postTags: {
      connect: postTagIds.map((postTagId) => ({
        postTagId,
      })),
    },
  };

  const systemSpecs = await findUniqueSystemSpecForPost(steamUserId, systemName);

  if (!systemSpecs) {
    return prisma.steamPerformancePost.update({
      where: {
        id: postId,
      },
      data: performancePostData,
    });
  }

  return prisma.steamPerformancePost.update({
    where: {
      id: postId,
    },
    data: {
      ...performancePostData,
      systemManufacturer: systemSpecs.manufacturer,
      systemModel: systemSpecs.model,
      systemOsVersion: systemSpecs.osVersion,
      systemCpuBrand: systemSpecs.cpuBrand,
      systemVideoDriver: systemSpecs.videoDriver,
      systemVideoDriverVersion: systemSpecs.videoDriverVersion,
      systemVideoPrimaryVRAM: systemSpecs.videoPrimaryVRAM,
      systemMemoryRAM: systemSpecs.memoryRAM,
    },
  });
}

export async function findPerformancePostByPostId(
    postId: string,
) {
  return prisma.steamPerformancePost.findUnique({
    where: {
      id: postId,
    },
    select: {
      _count: {
        select: {
          usersWhoLiked: true,
        },
      },
      id: true,
      createdAt: true,
      steamUserId: true,
      avatarMedium: true,
      displayName: true,
      frameRateAverage: true,
      frameRateStutters: true,
      gamepadMetadata: {
        select: {
          gamepadId: true,
          description: true,
        },
      },
      gamepadRating: true,
      postText: true,
      postTags: {
        select: {
          postTagId: true,
          description: true,
        },
      },
      ratingMedal: true,
      steamApp: {
        select: {
          name: true,
          steamAppId: true,
        },
      },
      systemManufacturer: true,
      systemModel: true,
      systemOsVersion: true,
      systemCpuBrand: true,
      systemVideoDriver: true,
      systemVideoDriverVersion: true,
      systemVideoPrimaryVRAM: true,
      systemMemoryRAM: true,
    },
  });
}
