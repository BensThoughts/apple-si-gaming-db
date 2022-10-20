import prisma from '~/lib/database/db.server';

export async function findAllCategories() {
  return prisma.steamCategory.findMany({
    select: {
      categoryId: true,
      description: true,
    },
  });
}
