import { prisma } from '.';

import https from 'https';
import { logger } from '@apple-si-gaming-db/logger';

interface SteamAppListResponse {
  applist: {
    apps: {
      name: string;
      appid: number;
    }[]
  }
}

async function seed() {
  https.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/', (res) => {
    const data: Buffer[] = [];
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    logger.info('https get requested started');
    logger.info('Status Code: ' + res.statusCode);
    logger.info('Date in Response header: ' + headerDate);

    res.on('data', (chunk) => {
      data.push(chunk);
    });

    res.on('end', async () => {
      logger.info('https request ended');

      // * Clear the db of any currently stored data
      const steamResponse: SteamAppListResponse = JSON.parse(Buffer.concat(data).toString());
      const apps = steamResponse.applist.apps;

      const deDupedAppIds = apps.map((app) => app.appid).filter((e, i, a) => a.indexOf(e) === i);
      const deDupedApps = deDupedAppIds.map((appid) => {
        return {
          steamAppId: appid,
          name: apps.find((app) => app.appid === appid)!.name,
        };
      });
      logger.error('Length with dupes: ' + apps.length);
      logger.error('Length without dupes: ' + deDupedApps.length);

      logger.info('Start deleting all entries in db');
      await prisma.steamApp.deleteMany();
      logger.info('Finished deleting all entries in db');

      // * Create many with Prisma
      logger.info('Start writing games to DB');
      await prisma.steamApp.createMany({
        data: deDupedApps,
      }).catch((err) => {
        logger.error(err);
      });
      logger.info('Finished writing games to DB');
    });
  }).on('error', (err) => {
    logger.error(err);
  });
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
