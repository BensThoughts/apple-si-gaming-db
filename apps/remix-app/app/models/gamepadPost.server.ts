import type { SteamGamepadPost } from '~/interfaces/database';
import prisma from '~/lib/database/db.server';

export async function findGamepadPostsBySteamAppId(
    steamAppId: SteamGamepadPost['steamAppId'],
) {
  return prisma.steamGamepadPost.findMany({
    where: {
      steamAppId,
    },
    select: {
      id: true,
      createdAt: true,
      displayName: true,
      avatarMedium: true,
      postText: true,
      ratingMedal: true,
      postTags: {
        select: {
          postTagId: true,
          description: true,
        },
      },
      gamepadManufacturer: true,
      gamepadModel: true,
    },
  });
}
