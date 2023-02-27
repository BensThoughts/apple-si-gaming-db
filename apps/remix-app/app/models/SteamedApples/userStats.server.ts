import prisma from '~/lib/database/db.server';

export function findUserStatsBySteamUserId64(steamUserId64: number) {
  return prisma.userProfile.findUnique({
    where: {
      steamUserId64,
    },
    select: {
      userStats: true,
    },
  });
}

export async function addOneToNumTimesLoggedIn(userProfileId: number) {
  return prisma.userStats.upsert({
    where: {
      id: userProfileId,
    },
    create: {
      userProfile: {
        connect: {
          id: userProfileId,
        },
      },
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
