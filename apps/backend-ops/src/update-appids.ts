import { prisma } from '@apple-si-gaming-db/database';
import logger from '@apple-si-gaming-db/logger';
import { getSteamAppListRequest } from '@apple-si-gaming-db/steam-api';

async function updateAppIds() {
  try {
    const currApps = await prisma.steamApp.findMany({ select: { steamAppId: true } });
    logger.info(`Current AppIds in DB: ${currApps.length}`);
    const currAppIds = currApps.map((app) => app.steamAppId);
    const { applist } = await getSteamAppListRequest();
    const resApps = applist.apps;
    const newApps = resApps.filter((app) => !currAppIds.includes(app.appid));
    logger.info(`New AppIds to add to DB: ${newApps.length}`);
    logger.info('Adding new AppIds to DB');
    await prisma.steamApp.createMany({
      data: newApps.map((app) => ({
        steamAppId: app.appid,
        name: app.name,
      })),
    });
    logger.info('Added new AppIds Successfully');
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
  }
}

updateAppIds();