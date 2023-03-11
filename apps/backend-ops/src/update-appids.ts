import { prisma } from '@apple-si-gaming-db/database';
import { getSteamAppListRequest } from '@apple-si-gaming-db/steam-api';
import logger from './logger';


export async function updateAppIds() {
  try {
    const currApps = await prisma.steamApp.findMany({ select: { steamAppId: true } });
    logger.info(`there are ${currApps.length} appids in the database`);
    const currAppIds = currApps.map((app) => app.steamAppId);
    const { applist } = await getSteamAppListRequest();
    const resApps = applist.apps;
    const newApps = resApps.filter((app) => !currAppIds.includes(app.appid));
    logger.info(`there are  ${newApps.length} new appids to add to the database`);
    logger.info(`about to start adding ${newApps.length} appids to the database`);
    await prisma.steamApp.createMany({
      data: newApps.map((app) => ({
        steamAppId: app.appid,
        name: app.name,
      })),
    });
    logger.info(`added ${newApps.length} new appids to the database successfully`);
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
