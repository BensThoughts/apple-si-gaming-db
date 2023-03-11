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

import logger from './logger';

interface AppIdData {
  name: string;
  steamAppId: number;
  index: number;
  prevDataDownloadedAt: Date | null,
}

const logInfo = (message: string, appIdData: AppIdData, extra?: any) => {
  const { steamAppId, name, index, prevDataDownloadedAt } = appIdData;
  logger.info(message, {
    metadata: {
      steamApp: { steamAppId, name },
      extra: { index, prevDataDownloadedAt, ...extra },
    },
  });
};

const logWarn = (message: string, appIdData: AppIdData, extra?: any) => {
  const { steamAppId, name, index, prevDataDownloadedAt } = appIdData;
  logger.warn(message, {
    metadata: {
      steamApp: { steamAppId, name },
      extra: { index, prevDataDownloadedAt, ...extra },
    },
  });
};

const logError = (error: Error, appIdData: AppIdData) => {
  const { steamAppId, name, index, prevDataDownloadedAt } = appIdData;
  logger.warn(error.message, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    metadata: {
      steamApp: { steamAppId, name },
      extra: { index, prevDataDownloadedAt },
    },
  });
};


async function getSteamAppDataAndUpdateDB(appIdData: AppIdData) {
  const prismaSteamAppId = appIdData.steamAppId;

  try {
    logInfo(`https call started for ${appIdData.name}`, appIdData);
    const steamApiAppDetailsResponse = await getSteamAppDetailsRequest(prismaSteamAppId);
    const { success, data } = steamApiAppDetailsResponse;
    logInfo(`https call finished for ${appIdData.name}`, appIdData, steamApiAppDetailsResponse);

    // * Sometimes the steam API returns data for another (related) appid
    // * we don't want to clobber the data that comes in from the actual appid
    if (success === true && (data?.steam_appid === prismaSteamAppId)) {
      // const steamApiAppId = data.steam_appid;
      const prismaSteamAppData = convertSteamApiDataToPrisma(data);
      logInfo(`start writing to DB for ${appIdData.name}`, appIdData, prismaSteamAppData);
      await updateSteamApp(
          // steamApiAppId, // * Make sure we are using appid returned from steam api
          prismaSteamAppData,
      );
      logInfo(`finished writing to DB for ${appIdData.name}`, appIdData, prismaSteamAppData);
    } else {
      if (success != true) {
        logWarn(`no data returned from steam api for ${appIdData.name}`, appIdData);
      } else if (data?.steam_appid != prismaSteamAppId) {
        logWarn(`prisma appid of ${prismaSteamAppId} did not match steam api appid of ${data?.steam_appid}`, appIdData);
      }
      logInfo(`start writing downloaded attempted but not successful to DB for ${appIdData.name}`, appIdData);
      await updateSteamAppDownloadAttempted(prismaSteamAppId);
      logInfo(`finished writing download attempted but not successful to DB for ${appIdData.name}`, appIdData);
    }
  } catch (error) {
    if (error instanceof Error) {
      logError(error, appIdData);
    } else {
      logger.error(error);
    }
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

  const pageMeta = { page, totalPages, batchSize, options: { dataDownloadAttempted, daysSinceLastSync } };

  logger.info(`Starting page ${page} of ${totalPages}`, { metadata: { extra: pageMeta } });
  logger.info(`Page ${page} appids found in prisma: ${appIds.length}`, { metadata: { extra: pageMeta } });

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
      logger.info(`Finished page ${page} of ${totalPages}`, { metadata: { extra: { pageMeta } } });
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
  logger.info(`Getting number of pages for ${numAppIds} appids found in DB`, {
    metadata: {
      extra: {
        numAppIds,
        batchSize,
        options: { dataDownloadAttempted, daysSinceLastSync },
      },
    },
  });
  if (numAppIds < 1) {
    logger.info(`No apps found with these prisma settings, dataDownloadAttempted: ${dataDownloadAttempted} and daysSinceLastSync: ${daysSinceLastSync}`, {
      metadata: {
        extra: {
          where: getWhereInput(dataDownloadAttempted, daysSinceLastSync),
        },
      },
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
  logger.info(`Starting db sync with prisma settings, dataDownloadAttempted: ${dataDownloadAttempted} and daysSinceSync: ${daysSinceSync}`, {
    metadata: {
      extra: {
        where: getWhereInput(dataDownloadAttempted, daysSinceSync),
      },
    },
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
