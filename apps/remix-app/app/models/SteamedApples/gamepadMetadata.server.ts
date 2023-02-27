import prisma from '~/lib/database/db.server';

export async function findAllGamepads() {
  return prisma.gamepadMetadata.findMany({
    select: {
      id: true,
      description: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
};
