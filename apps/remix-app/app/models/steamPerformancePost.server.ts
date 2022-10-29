import type {
  SteamPerformancePost,
  SteamApp,
  SteamUser,
  SteamUserSystemSpecs,
  FrameRate,
  PostTag,
  Prisma,
  GamepadMetadata,
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
  steamUserId: SteamUser['steamUserId'];
  steamAppId: SteamApp['steamAppId'];
  postText: SteamPerformancePost['postText'];
  frameRateAverage?: FrameRate;
  frameRateStutters: boolean;
  ratingMedal: SteamPerformancePost['ratingMedal'];
  avatarMedium?: SteamPerformancePost['avatarMedium'];
  displayName?: SteamPerformancePost['displayName'];
  systemName: SteamUserSystemSpecs['systemName'];
  postTagIds: PostTag['postTagId'][];
  gamepadId?: GamepadMetadata['gamepadId'];
  gamepadRating?: GamepadRating;
}) {
  const performancePostData: Prisma.SteamPerformancePostCreateInput = {
    steamApp: {
      connect: {
        steamAppId,
      },
    },
    steamUser: {
      connect: {
        steamUserId,
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

export async function findPerformancePostsBySteamAppId(steamAppId: SteamApp['steamAppId']) {
  return prisma.steamPerformancePost.findMany({
    where: {
      steamAppId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      createdAt: true,
      avatarMedium: true,
      displayName: true,
      postText: true,
      postTags: {
        select: {
          postTagId: true,
          description: true,
        },
      },
      // TODO: Decide if we should use explicit vs. implicit
      // ! WITH JOIN TABLE
      // postTags: {
      //   select: {
      //     postTag: {
      //       select: {
      //         id: true,
      //         description: true,
      //       },
      //     },
      //   },
      // },
      ratingMedal: true,
      frameRateAverage: true,
      frameRateStutters: true,
      systemManufacturer: true,
      systemModel: true,
      systemOsVersion: true,
      systemCpuBrand: true,
      systemVideoDriver: true,
      systemVideoDriverVersion: true,
      systemVideoPrimaryVRAM: true,
      systemMemoryRAM: true,
      gamepadMetadata: {
        select: {
          gamepadId: true,
          description: true,
        },
      },
      gamepadRating: true,
    },
  });
}


export async function findNewestPerformancePosts(
    numPerformancePosts: number,
) {
  return prisma.steamPerformancePost.findMany({
    select: {
      id: true,
      steamAppId: true,
      steamApp: {
        select: {
          name: true,
          headerImage: true,
        },
      },
      createdAt: true,
      ratingMedal: true,
      postTags: {
        select: {
          postTagId: true,
          description: true,
        },
      },
      postText: true,
      displayName: true,
      avatarMedium: true,
      frameRateAverage: true,
      frameRateStutters: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: numPerformancePosts,
  });
}
