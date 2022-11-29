import prisma from '~/lib/database/db.server';

export function findSiteUserStatsForSteamUser(steamUserId: string) {
  return prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    select: {
      siteUserStats: true,
    },
  });
}
