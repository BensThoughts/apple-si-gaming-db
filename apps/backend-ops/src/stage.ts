import {
  getSteamAppDetailsRequest,
} from '@apple-si-gaming-db/steam-api';

import {
  convertSteamApiDataToPrisma,
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  prisma,
} from '@apple-si-gaming-db/database';

import { logger } from '@apple-si-gaming-db/logger';

interface AppIdData {
  steamAppId: number;
  appName: string;
  index: number;
  daysSincePrevSync: Date | null,
}

async function getSteamAppDataAndUpdateDB(appIdData: AppIdData) {
  const prismaSteamAppId = appIdData.steamAppId;

  try {
    logger.info('https call started', appIdData);
    const steamApiAppDetailsResponse = await getSteamAppDetailsRequest(prismaSteamAppId); // .catch((err))
    logger.info('https call finished', appIdData);
    const { success, data } = steamApiAppDetailsResponse;

    // * Sometimes the steam API returns data for another (related) appid
    // * we don't want to clobber the data that comes in from the actual appid
    if (success === true && (data?.steam_appid === prismaSteamAppId)) {
      // const steamApiAppId = data.steam_appid;
      const prismaSteamAppData = convertSteamApiDataToPrisma(data);

      logger.info('start writing to DB', appIdData);
      await updateSteamApp(
          // steamApiAppId, // * Make sure we are using appid returned from steam api
          prismaSteamAppData,
      );
      logger.info('finished writing to DB', appIdData);
    } else {
      if (success != true) {
        logger.warn('no data returned from steam api', appIdData);
      } else if (data?.steam_appid != prismaSteamAppId) {
        logger.warn('prisma appid did not match steam api appid', appIdData);
      }
      logger.info('start writing to DB', appIdData);
      await updateSteamAppDownloadAttempted(prismaSteamAppId);
      logger.info('finished writing to DB', appIdData);
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message, appIdData);
    }
    // throw err;
  }
}

async function getPageOfData(
    page: number,
    batchSize: number,
    totalPages: number,
    // whereDataDownloadAttempted?: true,
    // daysSinceLastSync?: number,
) {
  // const today = new Date();
  // const dateSinceLastSync = daysSinceLastSync
  //   ? new Date(today.setDate(today.getDate() - daysSinceLastSync))
  //   : undefined;
  const appIds = await prisma.steamApp.findMany({
    where: {
      dataDownloadAttempted: false,
      // dataDownloadAttemptedAt: dateSinceLastSync ? ({
      //   lte: dateSinceLastSync,
      // }) : undefined,
    },
    skip: page * batchSize,
    take: batchSize,
    select: {
      steamAppId: true,
      name: true,
      dataDownloadAttemptedAt: true,
    },
    orderBy: {
      steamAppId: 'asc',
    },
  });

  logger.info(`Starting page ${page} of ${totalPages}`);
  logger.info(`Page ${page} appids found in prisma: ${appIds.length}`);

  let totalIdx = page * batchSize;
  let currIdx = 0;

  const oneSecondInterval = setInterval(async () => {
    const appIdData: AppIdData = {
      appName: appIds[currIdx].name,
      steamAppId: appIds[currIdx].steamAppId,
      index: totalIdx,
      daysSincePrevSync: appIds[currIdx].dataDownloadAttemptedAt,
    };
    await getSteamAppDataAndUpdateDB(appIdData); // * await just to see at end of logs
    currIdx += 1;
    totalIdx += 1;
    if (currIdx >= appIds.length) {
      logger.info(`Finished page ${page} of ${totalPages}`);
      clearInterval(oneSecondInterval);
    }
  }, ONE_SECOND_INTERVAL);
}

const ONE_SECOND_INTERVAL = (1000); // 1seconds
const FIVE_MINUTE_INTERVAL = (5 * 60 * 1000) + 1000; // 5 minutes + 1 second

// DB starts at page 0

async function getTotalPages(
    batchSize: number,
    // whereDataDownloadAttempted?: boolean,
    // daysSinceLastSync?: number,
) {
  // const today = new Date();
  // const dateSinceLastSync = daysSinceLastSync
  //   ? new Date(today.setDate(today.getDate() - daysSinceLastSync))
  //   : undefined;
  const numAppIds = await prisma.steamApp.count({
    where: {
      dataDownloadAttempted: false,
      // dataDownloadAttemptedAt: dateSinceLastSync ? ({
      //   lte: dateSinceLastSync,
      // }) : undefined,
    },
  });
  logger.info(`Number of appids ${numAppIds}`);
  return Math.ceil(numAppIds / batchSize);
}


/**
 * Sync detailed information about each app in the db with the steam api.
 * Uses steams getAppDetails request
 * @param  {number} initialPage - The page of appids in db to start on
 * @param  {number} batchSize - The number of appids per a page
 * @param  {number} daysSinceSync - Only update apps that have not been synced
 * in daysSinceSync
 */
export async function stage(
    initialPage: number,
    batchSize: number,
    daysSinceSync?: number,
) {
  // const whereDataDownloadAttempted = daysSinceSync ? true : false;
  const totalPages = await getTotalPages(batchSize);

  getPageOfData(initialPage, batchSize, totalPages);

  let currPage = initialPage;

  const fiveMinuteInterval = setInterval(async () => {
    currPage += 1;
    if (currPage > totalPages) {
      clearInterval(fiveMinuteInterval);
    }
    getPageOfData(currPage, batchSize, totalPages);
  }, FIVE_MINUTE_INTERVAL);
}
