import {
  getSteamAppDetailsRequest,
} from '@apple-si-gaming-db/steam-api';

import {
  convertSteamApiDataToPrisma,
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  prisma,
} from '@apple-si-gaming-db/database';

import logger from '@apple-si-gaming-db/logger';

interface AppIdData {
  steamAppId: number;
  appName?: string;
  index?: number;
  steamId?: string;
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

async function getPageOfData(page: number, totalPages: number) {
  const appids = await prisma.steamApp.findMany({
    skip: page * BATCH_SIZE,
    take: BATCH_SIZE,
    select: {
      steamAppId: true,
      name: true,
    },
    orderBy: {
      steamAppId: 'asc',
    },
  });

  logger.info(`Starting page ${page} of ${totalPages}`);
  logger.info(`Page ${page} appids found in prisma: ${appids.length}`);

  let totalIdx = page * BATCH_SIZE;
  let currIdx = 0;

  const oneSecondInterval = setInterval(async () => {
    const appIdData: AppIdData = {
      appName: appids[currIdx].name,
      steamAppId: appids[currIdx].steamAppId,
      index: totalIdx,
    };
    await getSteamAppDataAndUpdateDB(appIdData); // * await just to see at end of logs
    currIdx += 1;
    totalIdx += 1;
    if (currIdx >= appids.length) {
      logger.info(`Finished page ${page} of ${totalPages}`);
      clearInterval(oneSecondInterval);
    }
  }, ONE_SECOND_INTERVAL);
}

const BATCH_SIZE = 200; // The number of apps per a "page" of data
const ONE_SECOND_INTERVAL = (1000); // 1seconds
const FIVE_MINUTE_INTERVAL = (5 * 60 * 1000) + 1000; // 5 minutes + 1 second

// DB starts at page 0
// const STARTING_PAGE = 3; // fly.io current page
const STARTING_PAGE = 144; // local current page

async function getTotalPages() {
  const aggregate = await prisma.steamApp.aggregate({ _count: true });
  const NUM_APPIDS = aggregate._count;
  logger.info(`Number of appids ${NUM_APPIDS}`);
  return Math.ceil(NUM_APPIDS / BATCH_SIZE);
}

export default async function stage() {
  let page = STARTING_PAGE;
  const TOTAL_PAGES = await getTotalPages();

  getPageOfData(page, TOTAL_PAGES);

  const fiveMinuteInterval = setInterval(async () => {
    page += 1;
    if (page > TOTAL_PAGES) {
      clearInterval(fiveMinuteInterval);
    }
    getPageOfData(page, TOTAL_PAGES);
  }, FIVE_MINUTE_INTERVAL);
}