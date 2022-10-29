import prisma from '~/lib/database/db.server';

export async function findAllGamepads() {
  return prisma.gamepadMetadata.findMany({
    select: {
      gamepadId: true,
      description: true,
    },
    orderBy: {
      gamepadId: 'asc',
    },
  });
};
