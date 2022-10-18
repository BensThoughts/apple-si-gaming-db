import prisma from '~/lib/database/db.server';

export async function findGamePads() {
  return prisma.steamGamepad.findMany({
    select: {
      gamepadId: true,
      description: true,
    },
  });
};
