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
  steamAppId,
  postText,
  ratingMedal,
  systemName,
}: {
  steamUserId: SteamUserWithoutMetadata['steamUserId'];
  steamAppId: SteamAppWithoutMetadata['steamAppId'];
  postText: PerformancePost['postText'];
  ratingMedal: PerformancePost['ratingMedal'];
  systemName: SteamUserSystemSpecs['systemName'],
}) {
  return prisma.performancePost.create({
    data: {
      postText,
      steamUserId,
      steamAppId,
      ratingMedal,
      systemName,
    },
  });
};

export async function findPerformancePostsByAppId(steamAppId: SteamAppWithoutMetadata['steamAppId']) {
  return prisma.performancePost.findMany({
    where: {
      steamAppId,
    },
    include: {
      steamUser: {
        select: {
          displayName: true,
          avatarMedium: true,
        },
      },
      systemSpecs: {
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
      },
    },
  });
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
