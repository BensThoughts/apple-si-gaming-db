import prisma from '~/lib/database/db.server';

export async function findSteamGamePads() {
  return prisma.steamGamepad.findMany({
    select: {
      gamepadId: true,
      description: true,
    },
    orderBy: {
      gamepadId: 'asc',
    },
  });
};
