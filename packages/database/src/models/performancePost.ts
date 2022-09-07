import type { Prisma, SteamAppWithoutMetadata } from '../interfaces';
import { prisma } from '../client';

export async function createPerformancePost({
  steamUserId,
  steamAppId,
  postText,
}: {
  steamUserId: string;
  steamAppId: number;
  postText: string;
}) {
  return prisma.performancePost.create({
    data: {
      postText,
      steamUserId,
      steamAppId,
    },
  });
};

export async function findPerformancePostsByAppId(
    steamAppId: SteamAppWithoutMetadata['steamAppId'],
    select?: Prisma.PerformancePostSelect,
) {
  return prisma.performancePost.findMany({
    where: {
      steamAppId,
    },
    select,
  });
}
