import chalk from 'chalk';
import { Command } from 'commander';
import { stage } from './stage';
import { updateAppIds } from './update-appids';
import logger from './logger';

const program = new Command();

program
    .name('@apple-si-gaming-db/backend-ops')
    .description(`ClI for @apple-si-gaming-db. Designed to keep the db in sync with steam
${chalk.red('DATABASE_URL env needs to be set correctly to connect to the db')}`)
    .version('0.0.1');

interface StageOpts {
  page: number;
  batchSize: number;
  dataDownloadAttempted: boolean | undefined;
  daysSinceSync: number | undefined;
}

program.command('stage')
    .description('Stage the entire db. Upsert data from the steam API to the db')
    .option(
        '-p, --page <number>',
        chalk.yellow('The initial page in the db to start on, 0 is the first page. Can also be set via env var ') +
        chalk.blue('$ASGD_INITIAL_PAGE'),
        '0',
    )
    .option(
        '-b, --batch-size <number>',
        chalk.yellow('The number of appids to pull from steam every 5 minutes. Can also be set via env var ') +
        chalk.blue('$ASGD_BATCH_SIZE'),
        '200',
    )
    .option(
        '--data-download-attempted',
        chalk.yellow('Update all apps where data download has already been attempted. Can also be set via env var ') +
        chalk.blue('$ASGD_DATA_DOWNLOAD_ATTEMPTED="1"'),
    )
    .option(
        '--no-data-download-attempted',
        chalk.yellow('Update all apps where data download has not been attempted. Can also be set via env var ') +
        chalk.blue('$ASGD_DATA_DOWNLOAD_ATTEMPTED="0"'),
    )
    .option(
        '--days-since-sync <number>',
        chalk.yellow('Only update data for apps that have not been synced in --days-since-sync days. Can also be set via env var ') +
        chalk.blue('$ASGD_DAYS_SINCE_SYNC'),
    )
    .action(async (opts: StageOpts) => {
      // const STARTING_PAGE = 3; // fly.io current page
      // const STARTING_PAGE = 145; // local current page
      const {
        ASGD_INITIAL_PAGE,
        ASGD_BATCH_SIZE,
        ASGD_DATA_DOWNLOAD_ATTEMPTED,
        ASGD_DAYS_SINCE_SYNC,
      } = process.env;
      const INITIAL_PAGE = Number(ASGD_INITIAL_PAGE ? ASGD_INITIAL_PAGE : opts.page);
      if (!isFinite(INITIAL_PAGE)) {
        logger.error('env var $ASGD_INITIAL_PAGE or option -p --page needs to be a valid number', {
          metadata: {
            extra: {
              '$ASGD_INITIAL_PAGE': ASGD_INITIAL_PAGE,
              'opts.page': opts.page,
            },
          },
        });
        process.exit(1);
      }

      const BATCH_SIZE = Number(ASGD_BATCH_SIZE ? ASGD_BATCH_SIZE : opts.batchSize);
      if (!isFinite(BATCH_SIZE)) {
        logger.error('env var $ASGD_BATCH_SIZE or option -b --batch-size needs to be a valid number', {
          metadata: {
            extra: {
              '$ASGD_BATCH_SIZE': ASGD_BATCH_SIZE,
              'opts.batchSize': opts.batchSize,
            },
          },
        });
        process.exit(1);
      }

      let DAYS_SINCE_SYNC: number | undefined = undefined;
      if (ASGD_DAYS_SINCE_SYNC) {
        DAYS_SINCE_SYNC = Number(ASGD_DAYS_SINCE_SYNC);
      } else {
        DAYS_SINCE_SYNC = opts.daysSinceSync;
      }
      if (DAYS_SINCE_SYNC && !isFinite(DAYS_SINCE_SYNC)) {
        logger.error('env var $ASGD_DAYS_SINCE_SYNC or option --days-since-sync needs to be a valid number or unset (undefined)', {
          metadata: {
            extra: {
              '$ASGD_DAYS_SINCE_SYNC': ASGD_DAYS_SINCE_SYNC,
              'opts.daysSinceSync': opts.daysSinceSync,
            },
          },
        });
        process.exit(1);
      }

      let DATA_DOWNLOAD_ATTEMPTED: undefined | boolean = undefined;
      if (ASGD_DATA_DOWNLOAD_ATTEMPTED) {
        if (
          !(
            (ASGD_DATA_DOWNLOAD_ATTEMPTED === '1') ||
            (ASGD_DATA_DOWNLOAD_ATTEMPTED === '0')
          )
        ) {
          logger.error('env var DATA_DOWNLOAD_ATTEMPTED must be either 0, 1, or unset');
          process.exit(1);
        }
        if (DAYS_SINCE_SYNC && (ASGD_DATA_DOWNLOAD_ATTEMPTED === '1')) {
          DATA_DOWNLOAD_ATTEMPTED = undefined;
        } else if (DAYS_SINCE_SYNC && (ASGD_DATA_DOWNLOAD_ATTEMPTED === '0')) {
          DATA_DOWNLOAD_ATTEMPTED = false;
        } else {
          DATA_DOWNLOAD_ATTEMPTED = (ASGD_DATA_DOWNLOAD_ATTEMPTED === '1') ? true : false;
        }
      } else {
        if (DAYS_SINCE_SYNC && (opts.dataDownloadAttempted === true)) {
          DATA_DOWNLOAD_ATTEMPTED = undefined;
        } else if (DAYS_SINCE_SYNC && (opts.dataDownloadAttempted === false)) {
          DATA_DOWNLOAD_ATTEMPTED = false;
        } else {
          DATA_DOWNLOAD_ATTEMPTED = opts.dataDownloadAttempted;
        }
      }

      logger.info(`Initial page set to ${INITIAL_PAGE}`);
      logger.info(`Batch size set to ${BATCH_SIZE}`);
      logger.info(`Data download attempted set to ${DATA_DOWNLOAD_ATTEMPTED}`);
      logger.info(`Days since sync set to ${DAYS_SINCE_SYNC}`);
      stage(INITIAL_PAGE, BATCH_SIZE, DATA_DOWNLOAD_ATTEMPTED, DAYS_SINCE_SYNC);
    });

program.command('update-appids')
    .description('Sync the appids in db with the steam-api')
    .action(async () => {
      await updateAppIds();
    });

program.parse();
