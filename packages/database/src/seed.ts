import { prisma } from '.';
import type { Prisma } from './interfaces/index';
import logger from './logger';
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
  logger.info('starting to delete all SteamApps from the database');
  await prisma.steamApp.deleteMany();
  logger.info('successfully deleted all SteamApps from the database');
  logger.info('starting to request the applist from the Steam API');
  const { applist } = await getSteamAppListRequest();
  logger.info('successfully received the applist from the Steam API');
  const { apps } = applist;
  logger.info('starting to create SteamApps in the database using the applist');
  await prisma.steamApp.createMany({
    data: apps.map((app) => ({
      steamAppId: app.appid,
      name: app.name,
    })),
    skipDuplicates: true,
  });
  logger.info('successfully created SteamApps in the database using the applist');

  logger.info('starting to delete all PostTags from the database');
  await prisma.performancePostTag.deleteMany();
  logger.info('successfully deleted all PostTags from the database');
  logger.info('starting to create PostTags in the database');
  await prisma.performancePostTag.createMany({
    data: postTagCreateManyInput,
  });
  logger.info('successfully finished creating PostTags in the database');

  logger.info('starting to delete all SteamGamepads from the database');
  await prisma.gamepadMetadata.deleteMany();
  logger.info('successfully deleted SteamGamepads from the database');
  logger.info('starting to create SteamGamepads in the database');
  await prisma.gamepadMetadata.createMany({
    data: gamepadCreateManyInput,
  });
  logger.info('successfully created SteamGamepads in the database');
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
