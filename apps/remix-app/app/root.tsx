import { Suspense, lazy, useEffect, useState } from 'react';
import type {
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import type { ExtendedAppLoadContext } from '~/interfaces';
import type { SteamUserWithoutMetadata } from '~/interfaces/database';
import { getProfileSession, commitProfileSession } from './lib/sessions/cookie-sessions.server';

import tailwindStylesheetUrl from './styles/tailwind.css';
import { extractAppLoadContext } from './lib/data-utils/appLoadContext.server';
import {
  upsertSteamUser,
  updateUserOwnedApps,
} from './models/steamUser.server';
import { searchAllAppsByAppIds } from './models/steamApp.server';
import { getSteamPlayerOwnedGamesRequest } from './lib/data-utils/steamApi.server';
import Navbar from '~/components/Layout/Navbar';
import { Toaster } from 'react-hot-toast';

const ThemeProvider = lazy(() => import('./lib/context/colorMode'));

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <>{children}</> : null;
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  'charset': 'utf-8',
  'title': 'Apple Silicon Gaming DB',
  'viewport': 'width=device-width,initial-scale=1',
  'og:image': 'https://res.cloudinary.com/bensthoughts/image/upload/v1664943160/apple-silicon-gaming-db/og-images/og-image-home_yxvlgi.png',
  'og:url': 'https://apple-si-gaming-db-remix-app.fly.dev/',
  'og:type': 'website',
  'og:title': 'Apple Silicon on Steam DB',
  'og:description': 'Read and write performance reviews for Steam games running on Apple',
  'twitter:card': 'summary_large_image',
  'twitter:domain': 'apple-si-gaming-db-remix-app.fly.dev',
  'twitter:url': 'https://apple-si-gaming-db-remix-app.fly.dev/',
  'twitter:creator': '@bensthoughts',
  'twitter:site': '@bensthoughts',
  'twitter:title': 'Apple Silicon on Steam DB',
  'twitter:description': 'Read and write performance reviews for Steam games running on Apple',
  'twitter:image': 'https://res.cloudinary.com/bensthoughts/image/upload/v1664943160/apple-silicon-gaming-db/og-images/og-image-home_yxvlgi.png',
});

export async function loader({ request, context }: LoaderArgs) {
  const data = extractAppLoadContext(context);
  const { steamUser } = data;
  const profileSession = await getProfileSession(
      request.headers.get('Cookie'),
  );

  // TODO: May not need logic to only run get player owned games
  // TODO: on initial login, this might only run on first page
  // TODO: load/refresh anyways, and not not normal navigation/routing
  if (steamUser && profileSession && !profileSession.has('isLoggedIn')) {
    // cookie.isLoggedIn = true;
    profileSession.set('isLoggedIn', true);
    await upsertSteamUser(steamUser);
    const userOwnedApps = await getSteamPlayerOwnedGamesRequest(steamUser.steamUserId);
    const ownedAppIds = userOwnedApps.games.map((app) => app.appid);

    const ownedAppsInDB = await searchAllAppsByAppIds(ownedAppIds);
    const ownedAppIdsInDB = ownedAppsInDB.map((app) => app.steamAppId);
    await updateUserOwnedApps(ownedAppIdsInDB, steamUser.steamUserId);

    return json<ExtendedAppLoadContext>(data, {
      headers: {
        'Set-Cookie': await commitProfileSession(profileSession),
      },
    });
  }
  if (!steamUser) {
    // cookie.isLoggedIn = false;
    profileSession.unset('isLoggedIn');
    return json<ExtendedAppLoadContext>(data, {
      headers: {
        'Set-Cookie': await commitProfileSession(profileSession),
      },
    });
  }
  // TODO: Do I need to commit the session here too?
  return json<ExtendedAppLoadContext>(data, {
    headers: {
      'Set-Cookie': await commitProfileSession(profileSession),
    },
  });
}

function Document({
  children,
  title = 'Apple Silicon Gaming DB',
  steamUser,
  isSearchSubmitting,
}: {
  children: React.ReactNode,
  title?: string,
  steamUser?: SteamUserWithoutMetadata;
  isSearchSubmitting?: boolean;
}) {
  const setInitialTheme = `
  (function() {
    function getInitialColorMode() {
      const persistedColorPreference = window.localStorage.getItem('color-mode');
      const hasPersistedPreference = typeof persistedColorPreference === 'string';

      if (hasPersistedPreference) {
        return persistedColorPreference;
      }

      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const hasMediaQueryPreference = typeof mql.matches === 'boolean';
      if (hasMediaQueryPreference) {
        return mql.matches ? 'dark' : 'light';
      }

      return 'light';
    }

    const colorMode = getInitialColorMode();
    document.body.dataset.theme = colorMode;
  })()`;

  return (
    <html lang="en">
      <head>
        <Meta />
        {title ? <title>title</title> : null}
        <Links />
      </head>
      <body className="min-h-screen bg-app-bg">
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        <ClientOnly>
          <Suspense>
            <ThemeProvider>
              <Navbar
                authState={steamUser ? true : false}
                isSearchSubmitting={isSearchSubmitting ? isSearchSubmitting : false}
                className="h-14"
              />
              <div className="absolute top-14 w-full z-10">
                {children}
              </div>
            </ThemeProvider>
            <Toaster />
          </Suspense>
        </ClientOnly>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  // TODO: Getting cannot use loaderData in an error boundary errors,
  // TODO: with error being thrown on /profile, prob. because of this
  const loaderData = useLoaderData<typeof loader>();
  const transition = useTransition();
  const isSearchSubmitting =
    transition.state === 'submitting' &&
    transition.location.pathname === '/search';
  const steamUser = loaderData.steamUser;
  return (
    <Document
      steamUser={steamUser as SteamUserWithoutMetadata | undefined}
      isSearchSubmitting={isSearchSubmitting}
    >
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error">
      <div>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <Document title="Oops!">
      <div>
        <h1>Oops! - {caught.status} {caught.statusText}</h1>
        {caught.status === 404 && (
          <img
            src="/svg-images/four-oh-four-error.svg"
            alt="Four oh four error"
          />
        )}
      </div>
    </Document>
  );
}
