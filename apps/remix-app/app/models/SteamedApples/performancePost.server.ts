import type {
  PerformancePost,
  PerformancePostForNewPostsCard,
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
  AveragePerformancePostRating,
} from '~/types';
import type {
  PrismaPerformancePost,
  PrismaSteamApp,
  PrismaUserSystemSpec,
  PrismaPerformancePostTag,
  Prisma,
  PrismaGamepadMetadata,
  TierRank,
} from '~/types/database';
import prisma from '~/lib/database/db.server';
import { isTypeFrameRateTierRank, isTypeGamepadTierRank } from '~/lib/form-validators/posts';
import { findSystemSpecForPostBySystemSpecId } from './userSystemSpecs.server';
import { getAverageFrameRateTierRank, getAverageGamepadTierRank, getAverageRatingTierRank, getPercentPostsStutters } from '~/lib/conversions/rating-averages';


export async function createPerformancePost({
  steamUserId64,
  steamAppId,
  postText,
  frameRateTierRank,
  frameRateStutters,
  ratingTierRank,
  systemSpecId,
  postTagIds,
  gamepadId,
  gamepadTierRank,
}: {
  steamUserId64: string;
  steamAppId: PrismaSteamApp['steamAppId'];
  postText: PrismaPerformancePost['postText'];
  frameRateTierRank?: FrameRateTierRank;
  frameRateStutters: boolean;
  ratingTierRank: RatingTierRank;
  systemSpecId?: PrismaUserSystemSpec['id'];
  postTagIds: PrismaPerformancePostTag['id'][];
  gamepadId?: PrismaGamepadMetadata['id'];
  gamepadTierRank?: GamepadTierRank;
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
    frameRateTierRank,
    frameRateStutters,
    ratingTierRank,
    gamepadMetadata: gamepadId ? {
      connect: {
        id: gamepadId,
      },
    } : undefined,
    gamepadTierRank,
    postTags: {
      connect: postTagIds.map((id) => ({
        id,
      })),
    },
  };

  const systemSpecs =
    systemSpecId
      ? await findSystemSpecForPostBySystemSpecId(systemSpecId)
      : undefined;

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
      userSystemSpec: {
        connect: {
          id: systemSpecId,
        },
      },
    },
  });
};

export async function findAverageTotalRatingsOfPerformancePosts(
    steamAppId: PrismaPerformancePost['steamAppId'],
) : Promise<AveragePerformancePostRating> {
  const performancePosts = await prisma.performancePost.findMany({
    where: {
      steamAppId,
    },
    select: {
      ratingTierRank: true,
      frameRateTierRank: true,
      frameRateStutters: true,
      gamepadTierRank: true,
    },
  });
  const ratingTierRanks = performancePosts.map((post) => post.ratingTierRank);
  const avgRatingTierRank = getAverageRatingTierRank(ratingTierRanks);
  const frameRateTierRanks =
    performancePosts
        .map((post) => post.frameRateTierRank)
        .filter((rank): rank is FrameRateTierRank => isTypeFrameRateTierRank(rank));
  const avgFrameRateTierRank = getAverageFrameRateTierRank(frameRateTierRanks);
  const frameRateStuttersArr = performancePosts.map((post) => post.frameRateStutters);
  const percentPostsWhereFrameRateStutters = getPercentPostsStutters(frameRateStuttersArr);
  const frameRateStuttersTierRank = getFrameRateStuttersTierRank(percentPostsWhereFrameRateStutters);
  const gamepadTierRanks =
    performancePosts
        .map((post) => post.gamepadTierRank)
        .filter((rank): rank is GamepadTierRank => isTypeGamepadTierRank(rank));
  const avgGamepadTierRank = getAverageGamepadTierRank(gamepadTierRanks);

  return {
    avgRatingTierRank,
    avgFrameRateTierRank,
    percentPostsWhereFrameRateStutters,
    frameRateStuttersTierRank,
    avgGamepadTierRank,
  };
}

function getFrameRateStuttersTierRank(percentStutters: number): TierRank {
  let frameRateStuttersTierRank: TierRank = 'STier';
  switch (true) {
    case (percentStutters < 14):
      frameRateStuttersTierRank = 'STier';
      break;
    case (
      14 <= percentStutters &&
      percentStutters < 28
    ):
      frameRateStuttersTierRank = 'ATier';
      break;
    case (
      28 <= percentStutters &&
        percentStutters < 42
    ):
      frameRateStuttersTierRank = 'BTier';
      break;
    case (
      42 <= percentStutters &&
          percentStutters < 56
    ):
      frameRateStuttersTierRank = 'CTier';
      break;
    case (
      56 <= percentStutters &&
            percentStutters < 70
    ):
      frameRateStuttersTierRank = 'DTier';
      break;
    case (
      70 <= percentStutters &&
              percentStutters < 84
    ):
      frameRateStuttersTierRank = 'ETier';
      break;
    case (84 <= percentStutters):
      frameRateStuttersTierRank = 'FTier';
      break;
  }
  return frameRateStuttersTierRank;
}

export async function findPerformancePostsBySteamAppId(
    steamAppId: PrismaPerformancePost['steamAppId'],
) : Promise<PerformancePost[]> {
  const performancePosts = await prisma.performancePost.findMany({
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
      postText: true,
      ratingTierRank: true,
      frameRateTierRank: true,
      frameRateStutters: true,
      gamepadMetadata: {
        select: {
          id: true,
          description: true,
        },
      },
      gamepadTierRank: true,
      postTags: {
        select: {
          id: true,
          description: true,
        },
      },
      steamApp: {
        select: {
          name: true,
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
  return performancePosts.map(({
    id,
    _count: {
      usersWhoLiked,
    },
    createdAt,
    steamApp: {
      name,
    },
    steamUserProfile: {
      steamUserId64,
      displayName,
      avatarMedium,
    },
    postText,
    ratingTierRank,
    frameRateTierRank,
    frameRateStutters,
    gamepadMetadata,
    gamepadTierRank,
    postTags,
    systemManufacturer,
    systemModel,
    systemOsVersion,
    systemCpuBrand,
    systemVideoDriver,
    systemVideoDriverVersion,
    systemVideoPrimaryVRAM,
    systemMemoryRAM,
  }) => ({
    performancePostId: id,
    postText,
    createdAt: createdAt.toDateString(),
    steamApp: {
      steamAppId,
      name,
    },
    userWhoCreated: {
      steamUserId64: steamUserId64.toString(),
      displayName,
      avatarMedium,
    },
    rating: {
      ratingTierRank,
      frameRateTierRank:
        isTypeFrameRateTierRank(frameRateTierRank) ? frameRateTierRank : undefined,
      frameRateStutters,
      gamepadMetadata,
      gamepadTierRank:
        isTypeGamepadTierRank(gamepadTierRank) ? gamepadTierRank : undefined,
    },
    postTags,
    systemSpec: {
      manufacturer: systemManufacturer,
      model: systemModel,
      osVersion: systemOsVersion,
      cpuBrand: systemCpuBrand,
      videoDriver: systemVideoDriver,
      videoDriverVersion: systemVideoDriverVersion,
      videoPrimaryVRAM: systemVideoPrimaryVRAM,
      memoryRAM: systemMemoryRAM,
    },
    numLikes: usersWhoLiked,
  }));
}

export async function findPerformancePostsBySteamUserId(
    steamUserId64: string,
): Promise<PerformancePost[]> {
  const performancePosts = await prisma.performancePost.findMany({
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
      frameRateTierRank: true,
      frameRateStutters: true,
      ratingTierRank: true,
      gamepadMetadata: {
        select: {
          id: true,
          description: true,
        },
      },
      gamepadTierRank: true,
      postTags: true,
      steamApp: {
        select: {
          steamAppId: true,
          name: true,
          headerImage: true,
        },
      },
      steamUserId64: true,
      systemManufacturer: true,
      systemModel: true,
      systemCpuBrand: true,
      systemOsVersion: true,
      systemVideoDriver: true,
      systemVideoDriverVersion: true,
      systemVideoPrimaryVRAM: true,
      systemMemoryRAM: true,
    },
  });
  return performancePosts.map(({
    id,
    createdAt,
    postText,
    _count: {
      usersWhoLiked,
    },
    frameRateTierRank,
    frameRateStutters,
    ratingTierRank,
    gamepadMetadata,
    gamepadTierRank,
    postTags,
    steamApp: {
      steamAppId,
      name,
      headerImage,
    },
    steamUserId64,
    systemManufacturer,
    systemModel,
    systemCpuBrand,
    systemOsVersion,
    systemVideoDriver,
    systemVideoDriverVersion,
    systemVideoPrimaryVRAM,
    systemMemoryRAM,
  }) => ({
    performancePostId: id,
    createdAt: createdAt.toDateString(),
    postText,
    postTags,
    userWhoCreated: {
      steamUserId64: steamUserId64.toString(),
    },
    steamApp: {
      steamAppId,
      name,
      headerImage,
    },
    rating: {
      ratingTierRank,
      frameRateTierRank:
        isTypeFrameRateTierRank(frameRateTierRank) ? frameRateTierRank : undefined,
      frameRateStutters,
      gamepadMetadata,
      gamepadTierRank:
        isTypeGamepadTierRank(gamepadTierRank) ? gamepadTierRank : undefined,
    },
    numLikes: usersWhoLiked,
    systemSpec: {
      manufacturer: systemManufacturer,
      model: systemModel,
      cpuBrand: systemCpuBrand,
      osVersion: systemOsVersion,
      videoDriver: systemVideoDriver,
      videoDriverVersion: systemVideoDriverVersion,
      videoPrimaryVRAM: systemVideoPrimaryVRAM,
      memoryRAM: systemMemoryRAM,
    },
  }));
}


export async function findNewestPerformancePosts(
    numPerformancePosts: number,
): Promise<PerformancePostForNewPostsCard[]> {
  const performancePosts = await prisma.performancePost.findMany({
    select: {
      id: true,
      createdAt: true,
      steamApp: {
        select: {
          steamAppId: true,
          name: true,
        },
      },
      ratingTierRank: true,
      postText: true,
      steamUserProfile: {
        select: {
          steamUserId64: true,
          displayName: true,
          avatarFull: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    // with numPerformancePosts at 7, someone would have to write
    // over 133 posts before findNewestPerformancePosts starts
    // returning less than 7 posts
    take: numPerformancePosts * 20,
  });
  const postsWithUniqueAuthor = new Map<BigInt, PerformancePostForNewPostsCard>();
  for (let i = 0; i < performancePosts.length; i++) {
    const {
      id,
      postText,
      steamApp: {
        steamAppId,
        name,
      },
      steamUserProfile: {
        steamUserId64,
        displayName,
        avatarFull,
      },
    } = performancePosts[i];
    if (!postsWithUniqueAuthor.has(steamUserId64)) {
      postsWithUniqueAuthor.set(steamUserId64, {
        performancePostId: id,
        postText,
        steamApp: {
          steamAppId,
          name,
        },
        userWhoCreated: {
          displayName,
          avatarFull,
        },
      });
    }
    if (postsWithUniqueAuthor.size >= numPerformancePosts) {
      break;
    }
  }
  return Array.from(postsWithUniqueAuthor, (entry) => {
    return entry[1];
  });
}

// We use steamUserId64 as the source of truth for who created the post
export async function didSteamUserProfileCreatePerformancePost(
    steamUserId64: string,
    performancePostId: number,
) {
  const performancePost = await prisma.performancePost.findUnique({
    where: {
      id: performancePostId,
    },
    select: {
      steamUserId64: true,
    },
  });
  if (
    performancePost &&
    (
      performancePost.steamUserId64.toString() === steamUserId64
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
  performancePostId,
  postText,
  frameRateTierRank,
  frameRateStutters,
  ratingTierRank,
  systemSpecId,
  postTagIds,
  gamepadId,
  gamepadTierRank,
}: {
  performancePostId: PrismaPerformancePost['id'];
  postText: PrismaPerformancePost['postText'];
  frameRateTierRank?: FrameRateTierRank;
  frameRateStutters: boolean;
  ratingTierRank: RatingTierRank;
  systemSpecId?: PrismaUserSystemSpec['id'];
  postTagIds: PrismaPerformancePostTag['id'][];
  gamepadId?: PrismaGamepadMetadata['id'];
  gamepadTierRank?: GamepadTierRank;
}) {
  const currentPerformancePost = await prisma.performancePost.findUnique({
    where: { id: performancePostId },
    select: { postTags: { select: { id: true } }, gamepadId: true },
  });
  if (!currentPerformancePost) throw Error(`Cannot find post with id: ${performancePostId}`);
  const { postTags: currentPostTags } = currentPerformancePost;
  const currentPerformancePostTagIds = currentPostTags.map((tag) => tag.id);
  const performancePostTagIdsToDisconnect =
    currentPerformancePostTagIds.filter((tagId) => !postTagIds.includes(tagId));

  // const { gamepadId: currentGamepadId } = currentPerformancePost;

  const performancePostData: Prisma.PerformancePostUpdateInput = {
    postText,
    ratingTierRank,
    frameRateTierRank: frameRateTierRank ? frameRateTierRank : null,
    frameRateStutters,
    gamepadMetadata: gamepadId ? {
      connect: {
        id: gamepadId,
      },
      // disconnect: currentGamepadId ? true : undefined,
    } : {
      disconnect: true,
    },
    gamepadTierRank: gamepadId ? gamepadTierRank : null,
    // gamepadRating: gamepadId ? gamepadRating : null,
    postTags: {
      connect: postTagIds.map((id) => ({ id })),
      disconnect: performancePostTagIdsToDisconnect.map((id) => ({ id })),
    },
    systemManufacturer: null,
    systemModel: null,
    systemOsVersion: null,
    systemCpuBrand: null,
    systemVideoDriver: null,
    systemVideoDriverVersion: null,
    systemVideoPrimaryVRAM: null,
    systemMemoryRAM: null,
    userSystemSpec: { // This gets overridden if there is a systemSpec found, as seen below
      disconnect: true,
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
          userSystemSpec: {
            connect: {
              id: systemSpecId,
            },
          },
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
): Promise<PerformancePost | undefined> {
  const performancePost = await prisma.performancePost.findUnique({
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
          steamUserId64: true,
          displayName: true,
          avatarMedium: true,
        },
      },
      frameRateTierRank: true,
      frameRateStutters: true,
      gamepadMetadata: {
        select: {
          id: true,
          description: true,
        },
      },
      gamepadTierRank: true,
      postText: true,
      postTags: {
        select: {
          id: true,
          description: true,
        },
      },
      ratingTierRank: true,
      steamApp: {
        select: {
          steamAppId: true,
          name: true,
        },
      },
      userSystemSpecId: true,
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
  if (!performancePost) {
    return undefined;
  }
  const {
    id,
    createdAt,
    _count: {
      usersWhoLiked,
    },
    steamApp: {
      steamAppId,
      name,
    },
    steamUserProfile: {
      steamUserId64,
      displayName,
      avatarMedium,
    },
    postText,
    postTags,
    ratingTierRank,
    frameRateTierRank,
    frameRateStutters,
    gamepadMetadata,
    gamepadTierRank,
    userSystemSpecId,
    systemManufacturer,
    systemModel,
    systemOsVersion,
    systemCpuBrand,
    systemVideoDriver,
    systemVideoDriverVersion,
    systemVideoPrimaryVRAM,
    systemMemoryRAM,
  } = performancePost;
  return {
    performancePostId: id,
    createdAt: createdAt.toDateString(),
    postText,
    steamApp: {
      steamAppId,
      name,
    },
    userWhoCreated: {
      steamUserId64: steamUserId64.toString(),
      displayName,
      avatarMedium,
    },
    rating: {
      ratingTierRank,
      frameRateTierRank:
        isTypeFrameRateTierRank(frameRateTierRank) ? frameRateTierRank : undefined,
      frameRateStutters,
      gamepadMetadata,
      gamepadTierRank:
        isTypeGamepadTierRank(gamepadTierRank) ? gamepadTierRank : undefined,
    },
    systemSpec: {
      systemSpecId: userSystemSpecId,
      manufacturer: systemManufacturer,
      model: systemModel,
      osVersion: systemOsVersion,
      cpuBrand: systemCpuBrand,
      videoDriver: systemVideoDriver,
      videoDriverVersion: systemVideoDriverVersion,
      videoPrimaryVRAM: systemVideoPrimaryVRAM,
      memoryRAM: systemMemoryRAM,
    },
    postTags,
    numLikes: usersWhoLiked,
  };
}
