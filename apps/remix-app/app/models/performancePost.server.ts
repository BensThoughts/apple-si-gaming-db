import type {
  SteamAppWithoutMetadata,
  SteamUserWithoutMetadata,
} from '~/interfaces/database';
import prisma from '~/lib/database/db.server';

export async function createPerformancePost({
  steamUserId,
  steamAppId,
  postText,
}: {
  steamUserId: SteamUserWithoutMetadata['steamUserId'];
  steamAppId: SteamAppWithoutMetadata['steamAppId'];
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
