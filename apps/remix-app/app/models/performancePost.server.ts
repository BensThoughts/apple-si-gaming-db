import type { PrismaSteamApp } from '~/interfaces';
import prisma from '~/lib/database/db.server';

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

export async function getPerformancePostsByAppId(steamAppId: PrismaSteamApp['steamAppId']) {
  return prisma.performancePost.findMany({
    where: {
      steamAppId,
    },
  });
}
