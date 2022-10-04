import type {
  PerformancePost,
  SteamAppWithoutMetadata,
  SteamUserWithoutMetadata,
  RatingMedal,
  SteamUserSystemSpecs,
} from '~/interfaces/database';
import prisma from '~/lib/database/db.server';

export async function createPerformancePost({
  steamUserId,
  displayName,
  avatarMedium,
  steamAppId,
  postText,
  ratingMedal,
  systemName,
}: {
  steamUserId: SteamUserWithoutMetadata['steamUserId'];
  steamAppId: SteamAppWithoutMetadata['steamAppId'];
  postText: PerformancePost['postText'];
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
  if (!systemSpecs) {
    throw new Error(`System ${systemName} was not found in the database.`);
  }
  return prisma.performancePost.create({
    data: {
      steamUserId,
      displayName,
      avatarMedium,
      postText,
      steamAppId,
      ratingMedal,
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

export async function findPerformancePostsByAppId(steamAppId: SteamAppWithoutMetadata['steamAppId']) {
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
        )).slice(0, 10);
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

export function convertRatingMedalToNumber(ratingMedal: RatingMedal) {
  switch (ratingMedal) {
    case 'Borked':
      return 1;
    case 'Bronze':
      return 2;
    case 'Silver':
      return 3;
    case 'Gold':
      return 4;
    case 'Platinum':
      return 5;
    default:
      return 0;
  }
}
