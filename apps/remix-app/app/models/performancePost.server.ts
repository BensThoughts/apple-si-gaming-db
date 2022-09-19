import type {
  SteamAppWithoutMetadata,
  SteamUserWithoutMetadata,
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
  postText: string;
  ratingMedal: string;
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
