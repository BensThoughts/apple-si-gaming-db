import prisma from '~/lib/database/db.server';

export async function findSiteAchievementsForSteamUser(steamUserId: string) {
  return prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    select: {
      siteAchievements: true,
    },
  });
}

export async function giveSteamUserAchievement(
    steamUserId: string,
    achievementId: number,
) {
  return prisma.steamUser.update({
    where: {
      steamUserId,
    },
    data: {
      siteAchievements: {
        connect: {
          achievementId,
        },
      },
    },
  });
}
