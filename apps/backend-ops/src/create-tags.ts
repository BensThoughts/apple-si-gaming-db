import { prisma } from '@apple-si-gaming-db/database';
import type { Prisma } from '@apple-si-gaming-db/database';
import { logger } from '@apple-si-gaming-db/logger';

const postTagCreateManyInput: Prisma.PerformancePostTagCreateManyInput[] = [
  {
    id: 10,
    description: 'Native',
  },
  {
    id: 100,
    description: 'Rosetta 2',
  },
  {
    id: 219,
    description: 'CrossOver 19',
  },
  {
    id: 220,
    description: 'CrossOver 20',
  },
  {
    id: 221,
    description: 'CrossOver 21',
  },
  {
    id: 222,
    description: 'CrossOver 22',
  },
  {
    id: 316,
    description: 'Parallels 16',
  },
  {
    id: 317,
    description: 'Parallels 17',
  },
  {
    id: 318,
    description: 'Parallels 18',
  },
];

const gamepadCreateManyInput: Prisma.GamepadMetadataCreateManyInput[] = [
  {
    id: 120,
    manufacturer: 'Microsoft',
    model: 'Elite I',
    description: 'XBox Elite I',
  },
  {
    id: 121,
    manufacturer: 'Microsoft',
    model: 'Elite II',
    description: 'XBox Elite II',
  },
  {
    id: 130,
    manufacturer: 'Microsoft',
    model: 'Xbox One',
    description: 'XBox One',
  },
  {
    id: 140,
    manufacturer: 'Microsoft',
    model: 'XBox X/S',
    description: 'XBox X/S',
  },
  {
    id: 240,
    manufacturer: 'Sony',
    model: 'Playstation 4',
    description: 'Playstation 4',
  },
  {
    id: 250,
    manufacturer: 'Sony',
    model: 'Playstation 5',
    description: 'Playstation 5',
  },
];

export async function createTags({
  seedPostTags,
  seedGamepads,
}: {
  seedPostTags: boolean;
  seedGamepads: boolean;
}) {
  if (seedPostTags) {
    logger.info('starting post tag create many');
    await prisma.performancePostTag.createMany({
      data: postTagCreateManyInput,
      skipDuplicates: true,
    });
    logger.info('finished post tag create many');
  }
  if (seedGamepads) {
    logger.info('starting gamepad meta create many');
    await prisma.gamepadMetadata.createMany({
      data: gamepadCreateManyInput,
      skipDuplicates: true,
    });
    logger.info('finished gamepad meta create many');
  }
}
