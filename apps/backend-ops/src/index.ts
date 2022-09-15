import chalk from 'chalk';
import { Command } from 'commander';
import { stage } from './stage';
import { updateAppIds } from './update-appids';
import { logger } from '@apple-si-gaming-db/logger';
const program = new Command();

program
    .name('@apple-si-gaming-db/backend-ops')
    .description(`ClI for @apple-si-gaming-db. Designed to keep the db in sync with steam
${chalk.red('DATABASE_URL env needs to be set correctly to connect to the db')}`)
    .version('0.0.1');

program.command('stage')
    .description('Stage the entire db. Upsert data from the steam API to the db')
    .option(
        '-p, --page <number>',
        chalk.yellow('The initial page in the db to start on, 0 is the first page. Can also be set via env var $ASGD_INITIAL_PAGE'),
        '0',
    )
    .option(
        '-b, --batch-size <number>',
        chalk.yellow('The number of appids to pull from steam every 5 minutes. Can also be set via env var $ASGD_BATCH_SIZE'),
        '200',
    )
    .action(async (opts) => {
      // const STARTING_PAGE = 3; // fly.io current page
      // const STARTING_PAGE = 145; // local current page
      const {
        ASGD_INITIAL_PAGE,
        ASGD_BATCH_SIZE,
      } = process.env;
      const INITIAL_PAGE = Number(ASGD_INITIAL_PAGE ? ASGD_INITIAL_PAGE : opts.page);
      if (!isFinite(INITIAL_PAGE)) {
        logger.warn('env var $ASGD_INITIAL_PAGE or option -p --page needs to be a valid number', {
          '$ASGD_INITIAL_PAGE': ASGD_INITIAL_PAGE,
          'opts.page': opts.page,
        });
        process.exit(1);
      }

      const BATCH_SIZE = Number(ASGD_BATCH_SIZE ? ASGD_BATCH_SIZE : opts.batchSize);
      if (!isFinite(BATCH_SIZE)) {
        logger.warn('env var $ASGD_BATCH_SIZE or option -b --batch-size needs to be a valid number', {
          '$ASGD_BATCH_SIZE': ASGD_BATCH_SIZE,
          'opts.batchSize': opts.batchSize,
        });
        process.exit(1);
      }
      logger.info(`Initial page set to ${INITIAL_PAGE}`);
      logger.info(`Batch size set to ${BATCH_SIZE}`);
      stage(INITIAL_PAGE, BATCH_SIZE);
    });

program.command('update-appids')
    .description('Sync the appids in db with the steam-api')
    .action(async () => {
      await updateAppIds();
    });

program.parse();
