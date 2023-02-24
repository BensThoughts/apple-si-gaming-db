import { prisma } from '.';
import type { Prisma } from './interfaces/index';
import { logger } from '@apple-si-gaming-db/logger';
import { getSteamAppListRequest } from '@apple-si-gaming-db/steam-api';

const gamepadData: Prisma.GamepadMetadataCreateManyInput[] = [
  {
    id: 1,
    manufacturer: 'Microsoft',
    model: 'XBox One',
    description: 'XBox One',
  },
  {
    id: 2,
    manufacturer: 'Microsoft',
    model: 'XBox Elite I',
    description: 'XBox Elite I',
  },
  {
    id: 3,
    manufacturer: 'Microsoft',
    model: 'XBox Elite II',
    description: 'XBox Elite II',
  },
  {
    id: 4,
    manufacturer: 'Nintendo',
    model: 'Switch Pro',
    description: 'Switch Pro',
  },
  {
    id: 5,
    manufacturer: 'Nintendo',
    model: 'Switch',
    description: 'Switch',
  },
  {
    id: 6,
    manufacturer: 'Sony',
    model: 'Playstation 4',
    description: 'Playstation 4',
  },
  {
    id: 7,
    manufacturer: 'Sony',
    model: 'Playstation 5',
    description: 'Playstation 5',
  },
];

const postTagData: Prisma.PerformancePostTagCreateManyInput[] = [
  {
    id: 1,
    description: 'Native',
  },
  {
    id: 2,
    description: 'Parallels',
  },
  {
    id: 3,
    description: 'CrossOver',
  },
  {
    id: 4,
    description: 'VirtualBox',
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
    data: postTagData,
  });
  logger.info('finished creating PostTags');

  logger.info('started deleting SteamGamepads');
  await prisma.gamepadMetadata.deleteMany();
  logger.info('finished deleting SteamGamepads');
  logger.info('started creating gamepads');
  await prisma.gamepadMetadata.createMany({
    data: gamepadData,
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
