import type {
  PerformancePost,
  SteamApp,
  SteamUser,
  SteamUserSystemSpecs,
  FrameRate,
  PostTag,
  Prisma,
} from '~/interfaces/database';
import prisma from '~/lib/database/db.server';


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
}: {
  steamUserId: SteamUser['steamUserId'];
  steamAppId: SteamApp['steamAppId'];
  postText: PerformancePost['postText'];
  frameRateAverage?: FrameRate;
  frameRateStutters: boolean;
  ratingMedal: PerformancePost['ratingMedal'];
  avatarMedium?: PerformancePost['avatarMedium'];
  displayName?: PerformancePost['displayName'];
  systemName: SteamUserSystemSpecs['systemName'];
  postTagIds: PostTag['postTagId'][];
}) {
  const systemSpecs = await prisma.steamUserSystemSpecs.findUnique({
    where: {
      systemName_steamUserId: {
        steamUserId,
        systemName,
      },
    },
    select: {
      manufacturer: true,
      model: true,
      osVersion: true,
      cpuBrand: true,
      videoDriver: true,
      videoDriverVersion: true,
      videoPrimaryVRAM: true,
      memoryRAM: true,
    },
  });
  // TODO: Rather than throwing an error, maybe just let it pass
  // !Removed to allow no system specs on a performance post
  // if (!systemSpecs) {
  //   throw new Error(`System ${systemName} was not found in the database.`);
  // }

  const performancePostData: Prisma.XOR<Prisma.PerformancePostCreateInput, Prisma.PerformancePostUncheckedCreateInput> = {
    steamAppId,
    steamUserId,
    steamUserIdForSteamUser: steamUserId,
    displayName,
    avatarMedium,
    postText,
    frameRateAverage,
    frameRateStutters,
    ratingMedal,
    postTags: postTagIds.length > 0 ? {
      connect: postTagIds.map((postTagId) => ({
        postTagId,
      })),
    } : undefined,
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

  // !Added to allow no system specs on performance posts
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

export async function findPerformancePostsBySteamAppId(steamAppId: SteamApp['steamAppId']) {
  return prisma.performancePost.findMany({
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
    },
  });
}


export async function findLatestPerformancePosts(
    numPerformancePosts: number,
) {
  return prisma.performancePost.findMany({
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
