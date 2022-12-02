import prisma from '~/lib/database/db.server';

export async function findSiteAchievementsForSteamUser(steamUserId: string) {
  return prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    select: {
      siteAchievements: {
        select: {
          achievementId: true,
          title: true,
          description: true,
          imageUrl: true,
          svgCode: true,
        },
      },
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

export async function giveUserAchievement(
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

export async function giveUserFirstLoginAchievement(
    steamUserId: string,
) {
  return giveUserAchievement(steamUserId, 1);
}
