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

export async function addOneToNumTimesLoggedIn(steamUserId: string) {
  return prisma.siteUserStats.upsert({
    where: {
      steamUserId,
    },
    create: {
      steamUserId,
      numLogins: 1,
    },
    update: {
      numLogins: {
        increment: 1,
      },
    },
    select: {
      numLogins: true,
    },
  });
}
