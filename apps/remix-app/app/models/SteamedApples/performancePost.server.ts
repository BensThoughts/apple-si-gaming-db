import type {
  PrismaPerformancePost,
  PrismaSteamApp,
  PrismaUserSystemSpec,
  FrameRate,
  PrismaPostTag,
  Prisma,
  PrismaGamepadMetadata,
  GamepadRating,
} from '~/interfaces/database';
import prisma from '~/lib/database/db.server';
import { findSystemSpecForPostBySystemSpecId } from './userSystemSpecs.server';


export async function createPerformancePost({
  steamUserId64,
  // displayName,
  // avatarMedium,
  steamAppId,
  postText,
  frameRateAverage,
  frameRateStutters,
  ratingMedal,
  systemSpecId,
  postTagIds,
  gamepadId,
  gamepadRating,
}: {
  steamUserId64: string;
  steamAppId: PrismaSteamApp['steamAppId'];
  postText: PrismaPerformancePost['postText'];
  frameRateAverage?: FrameRate;
  frameRateStutters: boolean;
  ratingMedal: PrismaPerformancePost['ratingMedal'];
  // avatarMedium?: PrismaSteamUserProfile['avatarMedium'];
  // displayName?: PrismaSteamUserProfile['displayName'];
  systemSpecId?: PrismaUserSystemSpec['id'];
  postTagIds: PrismaPostTag['id'][];
  gamepadId?: PrismaGamepadMetadata['id'];
  gamepadRating?: GamepadRating;
}) {
  const performancePostData: Prisma.PerformancePostCreateInput = {
    steamApp: {
      connect: {
        steamAppId,
      },
    },
    steamUserProfile: {
      connect: {
        steamUserId64: BigInt(steamUserId64),
      },
    },
    postText,
    frameRateAverage,
    frameRateStutters,
    ratingMedal,
    gamepadMetadata: gamepadId ? {
      connect: {
        id: gamepadId,
      },
    } : undefined,
    gamepadRating,
    postTags: {
      connect: postTagIds.map((id) => ({
        id,
      })),
    },
  };

  const systemSpecs =
    systemSpecId
      ? await findSystemSpecForPostBySystemSpecId(systemSpecId)
      : null;

  if (!systemSpecs) {
    return prisma.performancePost.create({ data: performancePostData });
  }
  return prisma.performancePost.create({
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
    performancePostId: number,
    userProfileId: number,
) {
  return prisma.performancePost.update({
    where: {
      id: performancePostId,
    },
    data: {
      usersWhoLiked: {
        upsert: {
          where: {
            userProfileId_performancePostId: {
              userProfileId,
              performancePostId,
            },
          },
          update: {
            userProfileId,
          },
          create: {
            userProfileId,
          },
        },
      },
    },
  });
}

export async function unlikePost(
    performancePostId: number,
    userProfileId: number,
) {
  return prisma.performancePost.update({
    where: {
      id: performancePostId,
    },
    data: {
      usersWhoLiked: {
        deleteMany: {
          AND: {
            userProfileId,
            performancePostId,
          },
        },
      },
    },
  });
}

export async function findPerformancePostsBySteamAppId(
    steamAppId: PrismaPerformancePost['steamAppId'],
) {
  return prisma.performancePost.findMany({
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
      steamUserProfile: {
        select: {
          steamUserId64: true,
          avatarMedium: true,
          displayName: true,
        },
      },
      frameRateAverage: true,
      frameRateStutters: true,
      gamepadMetadata: {
        select: {
          id: true,
          description: true,
        },
      },
      gamepadRating: true,
      postText: true,
      postTags: {
        select: {
          id: true,
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

export async function findPerformancePostsBySteamUserId(
    steamUserId64: string,
) {
  return prisma.performancePost.findMany({
    where: {
      steamUserId64: BigInt(steamUserId64),
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
  return prisma.performancePost.findMany({
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
      steamUserProfile: {
        select: {
          steamUserId64: true,
          displayName: true,
          avatarMedium: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: numPerformancePosts,
  });
}

export async function didCurrentSessionUserCreatePost(
    steamUserId64: string,
    performancePostId: number,
) {
  const steamUserIdThatCreatedPost = await prisma.performancePost.findUnique({
    where: {
      id: performancePostId,
    },
    select: {
      steamUserId64: true,
    },
  });
  if (
    steamUserIdThatCreatedPost &&
    (
      steamUserIdThatCreatedPost.steamUserId64.toString() === steamUserId64
    )
  ) {
    return true;
  }
  return false;
}

export async function deletePerformancePost(performancePostId: PrismaPerformancePost['id']) {
  return prisma.performancePost.delete({
    where: {
      id: performancePostId,
    },
  });
}

export async function updatePerformancePost({
  steamUserId64,
  performancePostId,
  postText,
  frameRateAverage,
  frameRateStutters,
  ratingMedal,
  systemSpecId,
  postTagIds,
  gamepadId,
  gamepadRating,
}: {
  steamUserId64: string;
  performancePostId: PrismaPerformancePost['id'];
  postText: PrismaPerformancePost['postText'];
  frameRateAverage?: FrameRate;
  frameRateStutters: boolean;
  ratingMedal: PrismaPerformancePost['ratingMedal'];
  systemSpecId?: PrismaUserSystemSpec['id'];
  postTagIds: PrismaPostTag['id'][];
  gamepadId?: PrismaGamepadMetadata['id'];
  gamepadRating?: GamepadRating;
}) {
  const performancePostData: Prisma.PerformancePostUpdateInput = {
    postText,
    frameRateAverage,
    frameRateStutters,
    ratingMedal,
    gamepadMetadata: gamepadId ? {
      connect: {
        id: gamepadId,
      },
    } : undefined,
    gamepadRating,
    postTags: {
      connect: postTagIds.map((id) => ({
        id,
      })),
    },
  };

  if (systemSpecId) {
    const systemSpecs = await findSystemSpecForPostBySystemSpecId(systemSpecId);
    if (systemSpecs) {
      return prisma.performancePost.update({
        where: {
          id: performancePostId,
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
  }

  return prisma.performancePost.update({
    where: {
      id: performancePostId,
    },
    data: performancePostData,
  });
}

export async function findPerformancePostById(
    performancePostId: number,
) {
  return prisma.performancePost.findUnique({
    where: {
      id: performancePostId,
    },
    select: {
      _count: {
        select: {
          usersWhoLiked: true,
        },
      },
      id: true,
      createdAt: true,
      steamUserProfile: {
        select: {
          // steamUserId64: true,
          displayName: true,
          avatarMedium: true,
        },
      },
      frameRateAverage: true,
      frameRateStutters: true,
      gamepadMetadata: {
        select: {
          id: true,
          description: true,
        },
      },
      gamepadRating: true,
      postText: true,
      postTags: {
        select: {
          id: true,
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
