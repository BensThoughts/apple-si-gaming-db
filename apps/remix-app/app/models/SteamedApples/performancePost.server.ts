import type {
  PerformancePost,
  UserProfilePerformancePost,
} from '~/interfaces';
import type {
  PrismaPerformancePost,
  PrismaSteamApp,
  PrismaUserSystemSpec,
  FrameRate,
  PrismaPerformancePostTag,
  Prisma,
  PrismaGamepadMetadata,
  GamepadRating,
} from '~/interfaces/database';
import prisma from '~/lib/database/db.server';
import { findSystemSpecForPostBySystemSpecId } from './userSystemSpecs.server';


export async function createPerformancePost({
  steamUserId64,
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
  systemSpecId?: PrismaUserSystemSpec['id'];
  postTagIds: PrismaPerformancePostTag['id'][];
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
      ratingMedal: true,
      frameRateAverage: true,
      frameRateStutters: true,
      gamepadMetadata: {
        select: {
          id: true,
          description: true,
        },
      },
      gamepadRating: true,
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
    ratingMedal,
    frameRateAverage,
    frameRateStutters,
    gamepadMetadata,
    gamepadRating,
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
    createdAt,
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
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
      gamepadMetadata,
      gamepadRating,
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
): Promise<UserProfilePerformancePost[]> {
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
      frameRateAverage: true,
      frameRateStutters: true,
      ratingMedal: true,
      steamApp: {
        select: {
          steamAppId: true,
          name: true,
          headerImage: true,
        },
      },
      steamUserId64: true,
    },
  });
  return performancePosts.map(({
    id,
    createdAt,
    postText,
    _count: {
      usersWhoLiked,
    },
    frameRateAverage,
    frameRateStutters,
    ratingMedal,
    steamApp: {
      steamAppId,
      name,
      headerImage,
    },
    steamUserId64,
  }) => ({
    performancePostId: id,
    createdAt,
    postText,
    userWhoCreated: {
      steamUserId64: steamUserId64.toString(),
    },
    steamApp: {
      steamAppId,
      name,
      headerImage,
    },
    rating: {
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
    },
    numLikes: usersWhoLiked,
  }));
}


export async function findNewestPerformancePosts(
    numPerformancePosts: number,
): Promise<Omit<PerformancePost, 'postTags' | 'systemSpec' | 'numLikes'>[]> {
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
    take: numPerformancePosts * 20, // with numPerformancePosts at 5, someone would have to write
                                    // over 95 posts before this whole function starts
                                    // returning less than 5 posts
  });
  const postsWithUniqueAuthor = new Map<BigInt, Omit<PerformancePost, 'postTags' | 'systemSpec' | 'numLikes'>>();
  for (let i = 0; i < performancePosts.length; i++) {
    const {
      id,
      createdAt,
      postText,
      steamApp: {
        steamAppId,
        name,
      },
      ratingMedal,
      steamUserProfile: {
        steamUserId64,
        displayName,
        avatarMedium,
      },
    } = performancePosts[i];
    if (!postsWithUniqueAuthor.has(steamUserId64)) {
      postsWithUniqueAuthor.set(steamUserId64, {
        performancePostId: id,
        createdAt,
        postText,
        steamApp: {
          steamAppId,
          name,
        },
        rating: {
          ratingMedal,
        },
        userWhoCreated: {
          steamUserId64: steamUserId64.toString(),
          displayName,
          avatarMedium,
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
  frameRateAverage,
  frameRateStutters,
  ratingMedal,
  systemSpecId,
  postTagIds,
  gamepadId,
  gamepadRating,
}: {
  performancePostId: PrismaPerformancePost['id'];
  postText: PrismaPerformancePost['postText'];
  frameRateAverage?: FrameRate;
  frameRateStutters: boolean;
  ratingMedal: PrismaPerformancePost['ratingMedal'];
  systemSpecId?: PrismaUserSystemSpec['id'];
  postTagIds: PrismaPerformancePostTag['id'][];
  gamepadId?: PrismaGamepadMetadata['id'];
  gamepadRating?: GamepadRating;
}) {
  const currentPerformancePost = await prisma.performancePost.findUnique({
    where: { id: performancePostId },
    select: { postTags: true },
  });
  if (!currentPerformancePost) throw Error(`Cannot find post with id: ${performancePostId}`);
  const { postTags } = currentPerformancePost;
  const currentPerformancePostTagIds = postTags.map((tag) => tag.id);
  const performancePostTagIdsToDisconnect = currentPerformancePostTagIds.filter((tagId) => !postTagIds.includes(tagId));

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
    ratingMedal,
    frameRateAverage,
    frameRateStutters,
    gamepadMetadata,
    gamepadRating,
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
    createdAt,
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
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
      gamepadMetadata,
      gamepadRating,
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
