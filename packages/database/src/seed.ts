import { prisma } from '.';
import type { Prisma } from './interfaces/index';
import { logger } from '@apple-si-gaming-db/logger';
import { getSteamAppListRequest } from '@apple-si-gaming-db/steam-api';

const gamepadData: Prisma.GamepadMetadataCreateManyInput[] = [
  {
    gamepadId: 1,
    manufacturer: 'Microsoft',
    model: 'XBox One',
    description: 'XBox One',
  },
  {
    gamepadId: 2,
    manufacturer: 'Microsoft',
    model: 'XBox Elite I',
    description: 'XBox Elite I',
  },
  {
    gamepadId: 3,
    manufacturer: 'Microsoft',
    model: 'XBox Elite II',
    description: 'XBox Elite II',
  },
  {
    gamepadId: 4,
    manufacturer: 'Nintendo',
    model: 'Switch Pro',
    description: 'Switch Pro',
  },
  {
    gamepadId: 5,
    manufacturer: 'Nintendo',
    model: 'Switch',
    description: 'Switch',
  },
  {
    gamepadId: 6,
    manufacturer: 'Sony',
    model: 'Playstation 4',
    description: 'Playstation 4',
  },
  {
    gamepadId: 7,
    manufacturer: 'Sony',
    model: 'Playstation 5',
    description: 'Playstation 5',
  },
];

const postTagData: Prisma.PostTagCreateManyInput[] = [
  {
    postTagId: 1,
    description: 'Native',
  },
  {
    postTagId: 2,
    description: 'Parallels',
  },
  {
    postTagId: 3,
    description: 'CrossOver',
  },
  {
    postTagId: 4,
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
  await prisma.postTag.deleteMany();
  logger.info('finished deleting PostTags');
  logger.info('creating PostTags');
  await prisma.postTag.createMany({
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
