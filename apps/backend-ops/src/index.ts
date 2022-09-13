import chalk from 'chalk';
import { Command } from 'commander';
import { stage } from './stage';
const program = new Command();

program
    .name('@apple-si-gaming-db/backend-ops')
    .description(`ClI for @apple-si-gaming-db. Designed to keep the db in sync with steam
${chalk.red('DATABASE_URL env needs to be set correctly to connect to the db')}`)
    .version('0.0.1');

program.command('stage')
    .description('Stage the entire db. Upsert data from the steam API to the db')
    .option('-p, --page <number>', chalk.yellow('The initial page in the db to start on'), '0')
    .action(async (opts) => {
      // const STARTING_PAGE = 3; // fly.io current page
      // const STARTING_PAGE = 145; // local current page
      const initialPage = Number(opts.page);
      if (isNaN(initialPage)) {
        console.log(chalk.yellow('option -p --page needs to be a number'));
        process.exit(1);
      }
      stage(initialPage);
      // stage(initialPage);
    });

program.parse();
