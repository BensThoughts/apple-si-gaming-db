import {
  getSteamAppDetailsRequest,
} from '@apple-si-gaming-db/steam-api';

import type {
  Prisma } from '@apple-si-gaming-db/database';
import {
  convertSteamApiDataToPrisma,
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  prisma,
} from '@apple-si-gaming-db/database';

import { logger } from '@apple-si-gaming-db/logger';

interface AppIdData {
  name: string;
  steamAppId: number;
  index: number;
  prevDataDownloadedAt: Date | null,
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
    dataDownloadAttempted?: boolean,
    daysSinceLastSync?: number,
) {
  const appIds = await prisma.steamApp.findMany({
    where: getWhereInput(dataDownloadAttempted, daysSinceLastSync),
    skip: page * batchSize,
    take: batchSize,
    select: {
      steamAppId: true,
      name: true,
      dataDownloadedAt: true,
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
    const {
      name,
      steamAppId,
      dataDownloadedAt,
    } = appIds[currIdx];
    const appIdData: AppIdData = {
      name,
      steamAppId,
      prevDataDownloadedAt: dataDownloadedAt,
      index: totalIdx,
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

const ONE_SECOND_INTERVAL = (1100); // 1.1seconds trying to space out just a little more
const FIVE_MINUTE_INTERVAL = (5 * 60 * 1000) + 1000; // 5 minutes + 1 second

// DB starts at page 0

function getWhereInput(
    dataDownloadAttempted?: boolean,
    daysSinceLastSync?: number,
): Prisma.SteamAppWhereInput {
  const today = new Date();
  const dateSinceLastSync = daysSinceLastSync
    ? new Date(today.setDate(today.getDate() - daysSinceLastSync))
    : undefined;
  return {
    OR: ((dataDownloadAttempted !== undefined) || dateSinceLastSync) ? [
      {
        dataDownloadAttempted,
      },
      {
        dataDownloadedAt: dateSinceLastSync ? ({
          lte: dateSinceLastSync,
        }) : undefined,
      },
    ] : undefined,
  };
}

async function getTotalPages(
    batchSize: number,
    dataDownloadAttempted?: boolean,
    daysSinceLastSync?: number,
) {
  const numAppIds = await prisma.steamApp.count({
    where: getWhereInput(dataDownloadAttempted, daysSinceLastSync),
  });
  logger.info(`Number of appids ${numAppIds}`);
  if (numAppIds < 1) {
    logger.info('No apps found with these settings', {
      where: getWhereInput(dataDownloadAttempted, daysSinceLastSync),
    });
    process.exit(1);
  }
  return Math.floor(numAppIds / batchSize);
}


/**
 * Sync detailed information about each app in the db with the steam api.
 * Uses steams getAppDetails request
 * @param  {number} initialPage - The page of appids in db to start on
 * @param  {number} batchSize - The number of appids per a page
 * @param  {boolean} dataDownloadAttempted - If the app has ever had an attempt
 * to downloaded data from the steam api
 * @param  {number} daysSinceSync - Only update apps that have not been synced
 * in daysSinceSync
 */
export async function stage(
    initialPage: number,
    batchSize: number,
    dataDownloadAttempted?: boolean,
    daysSinceSync?: number,
) {
  logger.info('Starting db sync with settings', {
    where: getWhereInput(dataDownloadAttempted, daysSinceSync),
  });
  const totalPages = await getTotalPages(batchSize, dataDownloadAttempted, daysSinceSync);

  getPageOfData(initialPage, batchSize, totalPages, dataDownloadAttempted, daysSinceSync);

  let currPage = initialPage;

  const fiveMinuteInterval = setInterval(async () => {
    currPage += 1;
    if (currPage > totalPages) {
      clearInterval(fiveMinuteInterval);
    }
    getPageOfData(currPage, batchSize, totalPages, dataDownloadAttempted, daysSinceSync);
  }, FIVE_MINUTE_INTERVAL);
}
