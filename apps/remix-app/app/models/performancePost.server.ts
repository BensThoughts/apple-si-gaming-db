import type {
  PerformancePost,
  SteamApp,
  SteamUser,
  RatingMedal,
  SteamUserSystemSpecs,
  FrameRate,
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
}: {
  steamUserId: SteamUser['steamUserId'];
  steamAppId: SteamApp['steamAppId'];
  postText: PerformancePost['postText'];
  frameRateAverage: FrameRate | 'None';
  frameRateStutters: boolean;
  ratingMedal: PerformancePost['ratingMedal'];
  avatarMedium?: PerformancePost['avatarMedium'];
  displayName?: PerformancePost['displayName'];
  systemName: SteamUserSystemSpecs['systemName'];
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

  const performancePostData = {
    steamAppId,
    steamUserId,
    steamUserIdForSteamUser: steamUserId,
    displayName,
    avatarMedium,
    postText,
    frameRateAverage: frameRateAverage !== 'None' ? frameRateAverage : undefined,
    frameRateStutters,
    ratingMedal,
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

export async function findPerformancePostsByAppId(steamAppId: SteamApp['steamAppId']) {
  return prisma.performancePost.findMany({
    where: {
      steamAppId,
    },
    select: {
      id: true,
      createdAt: true,
      avatarMedium: true,
      displayName: true,
      postText: true,
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

export interface TrendingSteamApp {
  steamAppId: number;
  name: string;
  headerImage: string | null;
  releaseDate: string | null;
  numNewPerformancePosts: number;
}

export async function findTrendingSteamApps(
    daysInPast: number,
    numberOfTrendingApps: number,
) {
  const today = new Date();
  const dateInPast = new Date(today.setDate(today.getDate() - daysInPast));
  const steamAppsWithRecentPerformancePosts = await prisma.performancePost.findMany({
    where: {
      createdAt: {
        gte: dateInPast,
      },
    },
    take: 50,
    select: {
      steamApp: {
        select: {
          steamAppId: true,
          name: true,
          headerImage: true,
          releaseDate: true,
        },
      },
    },
  });
  const trendingSteamAppMap = new Map<number, TrendingSteamApp>();
  steamAppsWithRecentPerformancePosts.forEach(({ steamApp }) => {
    const trendingSteamApp = trendingSteamAppMap.get(steamApp.steamAppId);
    if (!trendingSteamApp) {
      trendingSteamAppMap.set(steamApp.steamAppId, {
        ...steamApp,
        numNewPerformancePosts: 1,
      });
    } else {
      const numNewPerformancePosts = trendingSteamApp.numNewPerformancePosts + 1;
      trendingSteamAppMap.set(steamApp.steamAppId, {
        ...steamApp,
        numNewPerformancePosts,
      });
    }
  });
  const trendingSteamApps =
    Array.from(trendingSteamAppMap.values())
        .sort((a, b) => (
          a.numNewPerformancePosts > b.numNewPerformancePosts ? -1 : 0
        )).slice(0, numberOfTrendingApps);
  return trendingSteamApps;
}

export function convertRatingMedalStringToRatingMedal(ratingMedal: string): RatingMedal {
  switch (ratingMedal.toLowerCase()) {
    case 'borked':
      return 'Borked';
    case 'bronze':
      return 'Bronze';
    case 'silver':
      return 'Silver';
    case 'gold':
      return 'Gold';
    case 'platinum':
      return 'Platinum';
    default:
      return 'Borked';
  }
}

