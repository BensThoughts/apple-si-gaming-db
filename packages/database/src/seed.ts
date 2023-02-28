import { prisma } from '.';
import type { Prisma } from './interfaces/index';
import { logger } from '@apple-si-gaming-db/logger';
import { getSteamAppListRequest } from '@apple-si-gaming-db/steam-api';

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

async function seed() {
  logger.info('deleting SteamApps');
  await prisma.steamApp.deleteMany();
  logger.info('deleting SteamApps finished');
  logger.info('https get requested started');
  const { applist } = await getSteamAppListRequest();
  logger.info('https get request finished');
  const { apps } = applist;
  logger.info('creating SteamApps started');
  await prisma.steamApp.createMany({
    data: apps.map((app) => ({
      steamAppId: app.appid,
      name: app.name,
    })),
    skipDuplicates: true,
  });
  logger.info('creating SteamApps finished');

  logger.info('started deleting PostTags');
  await prisma.performancePostTag.deleteMany();
  logger.info('finished deleting PostTags');
  logger.info('creating PostTags');
  await prisma.performancePostTag.createMany({
    data: postTagCreateManyInput,
  });
  logger.info('finished creating PostTags');

  logger.info('started deleting SteamGamepads');
  await prisma.gamepadMetadata.deleteMany();
  logger.info('finished deleting SteamGamepads');
  logger.info('started creating gamepads');
  await prisma.gamepadMetadata.createMany({
    data: gamepadCreateManyInput,
  });
  logger.info('finished creating gamepads');
}

seed()
    .catch((err) => {
      if (err instanceof Error) {
        logger.error(err);
      }
      logger.error(err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
