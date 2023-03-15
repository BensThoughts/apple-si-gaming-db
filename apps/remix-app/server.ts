import path from 'path';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { createRequestHandler } from '@remix-run/express';
import type { GetLoadContextFunction } from '@remix-run/express';
import passport from 'passport';
import SteamStrategy from 'passport-steam';
import session from 'cookie-session';
import type { ExtendedAppLoadContext, PassportSteamUser } from '~/interfaces';
import {
  convertPassportSteamUserToAppLoadContextSteamUser,
} from '~/lib/data-utils/appLoadContext.server';
import { logger } from '@apple-si-gaming-db/logger';

const app = express();

const morganMiddleWare = morgan('tiny', {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});

app.use(morganMiddleWare);


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: false | Express.User | null | undefined, done) => {
  done(null, obj);
});

const ASGD_PASSPORT_DOMAIN = process.env.ASGD_PASSPORT_DOMAIN;
if (!ASGD_PASSPORT_DOMAIN) {
  logger.error('env ASGD_PASSPORT_DOMAIN not set correctly');
  process.exit(1);
}
const ASGD_STEAM_API_KEY = process.env.ASGD_STEAM_API_KEY;
if (!ASGD_STEAM_API_KEY) {
  logger.error('env ASGD_STEAM_API_KEY not set correctly');
}

// @ts-ignore: 'new' expression, whose target lacks a construct signature,
// implicitly has an 'any' type.ts(7009)
passport.use(new SteamStrategy({
  name: 'steam',
  returnURL: `${ASGD_PASSPORT_DOMAIN}/api/auth/steam/return`,
  realm: `${ASGD_PASSPORT_DOMAIN}`,
  apiKey: `${ASGD_STEAM_API_KEY}`,
},
function(identifier: any, profile: any, done: any) {
  return done(null, profile);
},
));

const PASSPORT_COOKIE_NAME = 'passport-steam';
const PASSPORT_SESSION_SECRET = process.env.ASGD_PASSPORT_SESSION_SECRET;
if (!PASSPORT_SESSION_SECRET) {
  logger.error('env var ASGD_PASSPORT_SESSION_SECRET not set.');
  process.exit(1);
}

app.use(session({
  name: PASSPORT_COOKIE_NAME,
  secret: PASSPORT_SESSION_SECRET,
  sameSite: 'lax',
  // secure: process.env.NODE_ENV === 'production' ? true : false,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/auth/steam/login',
    passport.authenticate('steam'),

    // This function never runs. authenticate()
    // redirects user to steam
    function(req, res) { },
);

app.get('/api/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    async function(req, res) {
      res.redirect(302, '/');
    },
);

app.get('/api/auth/steam/logout',
    function(req, res) {
      req.session = null;
      res.redirect(302, '/logged-out');
    },
);

app.use((req, res, next) => {
  // helpful headers:
  res.set('x-fly-region', process.env.FLY_REGION ?? 'unknown');
  res.set('Strict-Transport-Security', `max-age=${60 * 60 * 24 * 365 * 100}`);

  // /clean-urls/ -> /clean-urls
  if (req.path.endsWith('/') && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
    res.redirect(301, safepath + query);
    return;
  }
  next();
});

// if we're not in the primary region, then we need to make sure all
// non-GET/HEAD/OPTIONS requests hit the primary region rather than read-only
// Postgres DBs.
// learn more: https://fly.io/docs/getting-started/multi-region-databases/#replay-the-request
app.all('*', function getReplayResponse(req, res, next) {
  const { method, path: pathname } = req;
  const { PRIMARY_REGION, FLY_REGION } = process.env;

  const isMethodReplayable = !['GET', 'OPTIONS', 'HEAD'].includes(method);
  const isReadOnlyRegion =
    FLY_REGION && PRIMARY_REGION && FLY_REGION !== PRIMARY_REGION;

  const shouldReplay = isMethodReplayable && isReadOnlyRegion;

  if (!shouldReplay) return next();

  const logInfo = {
    pathname,
    method,
    PRIMARY_REGION,
    FLY_REGION,
  };
  logger.info(`replaying ${method} request to ${pathname} from ${FLY_REGION} to ${PRIMARY_REGION}`, { metadata: { extra: logInfo } });
  res.set('fly-replay', `region=${PRIMARY_REGION}`);
  return res.sendStatus(409);
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use(
    '/build',
    express.static('public/build', { immutable: true, maxAge: '1y' }),
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }));

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), 'build');

function isPassportSteamUser(obj: unknown): obj is PassportSteamUser {
  if (
    typeof obj === 'object' &&
    obj != null &&
    'id' in obj &&
    'displayName' in obj &&
    'provider' in obj &&
    '_json' in obj
  ) {
    return true;
    // TODO: type-check indicates error TS2339: Property 'provider' does not exist on type '{}'
    // const { provider } = obj;
    // return typeof provider === 'string' && provider === 'steam';
  }
  return false;
}

const getLoadContext: GetLoadContextFunction = (req, res): ExtendedAppLoadContext => {
  const { user } = req;
  if (!isPassportSteamUser(user)) {
    return { steamUser: null };
  }
  const steamUser = convertPassportSteamUserToAppLoadContextSteamUser(user);
  return {
    steamUser,
  };
};

app.all(
    '*',
  MODE === 'production'
    ? createRequestHandler({
      build: require(BUILD_DIR),
      getLoadContext,
    })
    : (...args) => {
      purgeRequireCache();
      const requestHandler = createRequestHandler({
        build: require(BUILD_DIR),
        mode: MODE,
        getLoadContext,
      });
      return requestHandler(...args);
    },
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // require the built app so we're ready when the first request comes in
  require(BUILD_DIR);
  logger.info(`✅ app ready: http://localhost:${port}`);
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete require.cache[key];
    }
  }
}
