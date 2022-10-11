import prisma from '~/lib/database/db.server';

export async function findPostTags() {
  return prisma.postTag.findMany({
    select: {
      postTagId: true,
      description: true,
    },
    orderBy: {
      postTagId: 'asc',
    },
  });
}
