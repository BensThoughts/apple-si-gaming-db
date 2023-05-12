# Steamed Apples

This is an official mono repo for [Steamed Apples](https://www.steamedapples.com)

## What's inside?

This is a [turborepo](https://turbo.build/) monorepo. It includes the following packages/apps:

### Apps and Packages

- `apps/backend-ops`: a [node](https://nodejs.org/en) app that keeps the
  Postgres db in sync with all of the apps listed on the steam store page
- `apps/log-shipper`: configuration for fly.io's log shipper, used to ship logs
  to logtail
- `apps/postgres`: configuration for a postgres edge cluster that runs on fly.io
- `apps/remix-app`: the primary front/back end app for steamedapples.com. It is
  built using [remix](https://remix.run/), and ssr framework for React. WARNING:
  this app is extremely fast!
- `packages/database`: [Prisma](https://prisma.io/) ORM wrapper to manage &
  access the database
  `backend-ops` and `remix-app`
- `packages/eslint-config-custom`: `eslint` configurations (includes
  `turbo`, `prettier`, `google`,
  `@remix-run/eslint-config`, `@remix-run/eslint-config/node`, and some custom rules)
- `packages/invariant`: a forked version of tiny-invariant, modified to
  keep error messages even in a production env
- `packages/logger`: the main logger used throughout the backend, universally
  forces a format with typescript and tags each log line with the app/service is
  creating the log. Also is able to ship the logs to logtail.
- `packages/steam-api`: provides common methods and types for responses when
  accessing the steam-api
- `packages/tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Prisma](https://prisma.io/) for database ORM
- [Docker Compose](https://docs.docker.com/compose/) for local database

## Env variable files

There are 3 important .env files that you need to fill out. You can copy the
examples from `.env.example` to `.env` in their respective directories.

`apps/remix-app/.env`
`apps/backend-ops/.env`
`./.env`

### Database

I use [Prisma](https://prisma.io/) to manage & access the database. As such you will need a database for this project, either locally or hosted in the cloud.

To make this process easier, there is a
[`docker-compose.yml`](https://docs.docker.com/compose/) file to deploy a
Postgres server locally with a new database named `postgres`. The
`DATABASE_URL` can be set to connect to the database of your choosing.

```bash
cd apple-si-gaming-db
docker-compose up -d
```

Once deployed you will need to copy the `.env.example` file to `.env` in order for Prisma to have a `DATABASE_URL` environment variable to access.

```bash
cp .env.example .env
```

If you added a custom database name, or use a cloud based database, you will need to update the `DATABASE_URL` in your `.env` accordingly.

Once deployed & up & running, you will need to create & deploy migrations to your database to add the necessary tables. This can be done using [Prisma Migrate](https://www.prisma.io/migrate):

```bash
npx prisma migrate dev
```

If you need to push any existing migrations to the database, you can use either the Prisma db push or the Prisma migrate deploy command(s):

```bash
yarn run db:push

# OR

yarn run db:migrate:deploy
```

There is slight difference between the two commands & [Prisma offers a breakdown on which command is best to use](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push#choosing-db-push-or-prisma-migrate).

An important step to get this project running is to seed the database.
See [Prisma's seeding
functionality](https://www.prisma.io/docs/guides/database/seed-database) for
more details about seeding.

The seed script seeds the database with some initial gamepad and performance
post tags as well as every steam app ID and name from the steam api. After
seeding you will need to run the backend ops `stage` command from within the
backend ops directory to begin the process of filling in the details for every
steam app, see below.

Run the following command to run tell Prisma to run the seed script defined in the Prisma configuration:

```bash
yarn run db:seed
```

For further more information on migrations, seeding & more, we recommend reading
through the [Prisma Documentation](https://www.prisma.io/docs/).

### Staging

The database needs to be stages with some information prior to running the remix
app or you will not find any games/apps when you search for them or see them in
your user profile when you login with Steam.

To stage the db run the following

```bash
cd apple-si-gaming-db
yarn run build:backend-ops
yarn run dev:backend-ops:stage
```

### Build

To build all apps and packages, run the following command:

```bash
cd apple-si-gaming-db
yarn run build
```

To build just the remix-app, run:

```bash
cd apple-si-gaming-db
yarn run build:remix
```

To build just the backend-ops app, run:

```bash
cd apple-si-gaming-db
yarn run build:backend-ops
```

### Develop

The 2 primary apps you will want to run are `apps/backend-ops` and
`apps/remix-app`. After you have your db setup, running, and seeded, you can
begin running the remix app locally.

```bash
cd apple-si-gaming-db
yarn run dev:remix
```

To run the stage command for backend-ops you can run:

```bash
cd apple-si-gaming-db
yarn run dev:backend-ops:stage
```

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turborepo.org/docs/features/pipelines)
- [Caching](https://turborepo.org/docs/features/caching)
- [Remote Caching (Beta)](https://turborepo.org/docs/features/remote-caching)
- [Scoped Tasks](https://turborepo.org/docs/features/scopes)
- [Configuration Options](https://turborepo.org/docs/reference/configuration)
- [CLI Usage](https://turborepo.org/docs/reference/command-line-reference)
