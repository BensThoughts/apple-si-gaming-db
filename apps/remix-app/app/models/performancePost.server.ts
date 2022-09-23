import type {
  PerformancePost,
  SteamAppWithoutMetadata,
  SteamUserWithoutMetadata,
  RatingMedal,
} from '~/interfaces/database';
import prisma from '~/lib/database/db.server';

export async function createPerformancePost({
  steamUserId,
  steamAppId,
  postText,
  ratingMedal,
}: {
  steamUserId: SteamUserWithoutMetadata['steamUserId'];
  steamAppId: SteamAppWithoutMetadata['steamAppId'];
  postText: PerformancePost['postText'];
  ratingMedal: PerformancePost['ratingMedal'];
}) {
  return prisma.performancePost.create({
    data: {
      postText,
      steamUserId,
      steamAppId,
      ratingMedal,
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
