import { prisma } from '@apple-si-gaming-db/database';
import type { Prisma } from '@apple-si-gaming-db/database';
import { logger } from '@apple-si-gaming-db/logger';

const postTagCreateManyInput: Prisma.PostTagCreateManyInput[] = [
  {
    postTagId: 10,
    description: 'Native',
  },
  {
    postTagId: 100,
    description: 'Rosetta 2',
  },
  {
    postTagId: 219,
    description: 'CrossOver 19',
  },
  {
    postTagId: 220,
    description: 'CrossOver 20',
  },
  {
    postTagId: 221,
    description: 'CrossOver 21',
  },
  {
    postTagId: 222,
    description: 'CrossOver 22',
  },
  {
    postTagId: 316,
    description: 'Parallels 16',
  },
  {
    postTagId: 317,
    description: 'Parallels 17',
  },
  {
    postTagId: 318,
    description: 'Parallels 18',
  },
];

const gamepadCreateManyInput: Prisma.GamepadMetadataCreateManyInput[] = [
  {
    gamepadId: 120,
    manufacturer: 'Microsoft',
    model: 'Elite I',
    description: 'XBox Elite I',
  },
  {
    gamepadId: 121,
    manufacturer: 'Microsoft',
    model: 'Elite II',
    description: 'XBox Elite II',
  },
  {
    gamepadId: 130,
    manufacturer: 'Microsoft',
    model: 'Xbox One',
    description: 'XBox One',
  },
  {
    gamepadId: 140,
    manufacturer: 'Microsoft',
    model: 'XBox X/S',
    description: 'XBox X/S',
  },
  {
    gamepadId: 240,
    manufacturer: 'Sony',
    model: 'Playstation 4',
    description: 'Playstation 4',
  },
  {
    gamepadId: 250,
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
    await prisma.postTag.createMany({
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
