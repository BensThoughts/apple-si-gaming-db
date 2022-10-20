import prisma from '~/lib/database/db.server';

export async function findAllGenres() {
  return prisma.steamGenre.findMany({
    select: {
      genreId: true,
      description: true,
    },
  });
}
