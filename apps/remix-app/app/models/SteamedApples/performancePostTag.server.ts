import prisma from '~/lib/database/db.server';

export async function findPostTags() {
  return prisma.performancePostTag.findMany({
    select: {
      id: true,
      description: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
}
