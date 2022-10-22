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
// import { getProfileSession, commitProfileSession } from './lib/sessions/cookie-sessions.server';
import type { SteamGenre } from '~/interfaces/database';
import tailwindStylesheetUrl from './styles/tailwind.css';
import { metaTags } from '~/lib/meta-tags';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import Navbar from '~/components/Layout/Navbar';
import { Toaster } from 'react-hot-toast';
import { findUserProfileData, updateUserOwnedApps, upsertSteamUser } from '~/models/steamUser.server';

import type { SerializeFrom } from '@remix-run/node';
import { commitProfileSession, getProfileSession } from '~/lib/sessions/cookie-sessions.server';

const ThemeProvider = lazy(() => import('~/lib/context/colorMode'));

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
  'viewport': 'width=device-width,initial-scale=1',
  ...metaTags,
});

type RootLoaderData = {
  isLoggedIn: boolean;
  contextData: {
    steamUserId?: string | null;
    displayName?: string | null;
    avatarFull?: string | null,
  };
  prismaData?: {
    ownedApps: {
      steamAppId: number;
      name: string;
      headerImage: string | null;
      platformMac: boolean | null;
      genres: SteamGenre[];
    }[],
    systemSpecs: {
      systemName: string;
      manufacturer: string | null;
      model: string | null;
      cpuBrand: string | null;
      osVersion: string | null;
      videoDriver: string | null;
      videoDriverVersion: string | null;
      videoPrimaryVRAM: string | null;
      memoryRAM: string | null;
    }[],
  }
}

export type SerializedRootLoaderData = SerializeFrom<RootLoaderData>

export async function loader({ request, context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  const isLoggedIn = steamUser ? true : false;
  const profileSession = await getProfileSession(
      request.headers.get('Cookie'),
  );
  if (steamUser) {
    const {
      steamUserId,
      displayName,
      avatarFull,
    } = steamUser;
    // First time logging in need to add user to db
    if (!profileSession.has('alreadyLoggedIn')) {
      await upsertSteamUser(steamUser);
      await updateUserOwnedApps(steamUser.steamUserId);
      profileSession.set('alreadyLoggedIn', true);
    }
    const userProfile = await findUserProfileData(steamUser.steamUserId);
    if (userProfile) {
      const {
        ownedApps,
        systemSpecs,
      } = userProfile;
      // const systemNames = systemSpecs.map((systemSpec) => systemSpec.systemName);
      return json<RootLoaderData>({
        isLoggedIn,
        contextData: {
          steamUserId,
          displayName,
          avatarFull,
        },
        prismaData: {
          ownedApps,
          systemSpecs,
        },
      }, {
        headers: {
          'Set-Cookie': await commitProfileSession(profileSession),
        },
      });
    } else {
      return json<RootLoaderData>({
        isLoggedIn,
        contextData: {
          steamUserId,
          displayName,
          avatarFull,
        },
      }, {
        headers: {
          'Set-Cookie': await commitProfileSession(profileSession),
        },
      });
    }
  }

  return json<RootLoaderData>({
    isLoggedIn,
    contextData: {},
  }, {
    headers: {
      'Set-Cookie': await commitProfileSession(profileSession),
    },
  });
}

function Document({
  children,
  title = 'Apple Silicon Gaming DB',
  isLoggedIn,
  isSearchSubmitting,
}: {
  children: React.ReactNode;
  title?: string;
  isLoggedIn?: boolean;
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
                isLoggedIn={isLoggedIn ? isLoggedIn : false}
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
  const { isLoggedIn }= useLoaderData<RootLoaderData>();
  const transition = useTransition();
  const isSearchSubmitting =
    transition.state === 'submitting' &&
    transition.location.pathname === '/search';
  return (
    <Document
      isLoggedIn={isLoggedIn}
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
