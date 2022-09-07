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
} from '@remix-run/react';
import { json } from '@remix-run/node';
import Navbar from '~/components/Layout/Navbar';
import type { ExtendedAppLoadContext, PrismaSteamUser } from './interfaces';
import { loginCookie } from './lib/cookies/cookies.server';

// import { getUser } from "./session.server";
import tailwindStylesheetUrl from './styles/tailwind.css';
import { extractAppLoadContext } from './lib/data-utils/appLoadContext.server';
import { upsertSteamUser } from './models/steamUser.server';
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
  charset: 'utf-8',
  title: 'Apple Silicon Gaming DB',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({ request, context }: LoaderArgs) {
  const data = extractAppLoadContext(context);
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await loginCookie.parse(cookieHeader)) || {};
  if (data.steamUser && !cookie.isLoggedIn) {
    cookie.isLoggedIn = true;
    await upsertSteamUser(data.steamUser);
  }
  if (!data.steamUser) {
    cookie.isLoggedIn = false;
  }
  return json<ExtendedAppLoadContext>(data, {
    headers: {
      'Set-Cookie': await loginCookie.serialize(cookie),
    },
  });
}

function Document({
  children,
  title = 'Apple Silicon Gaming DB',
  steamUser,
}: {
  children: React.ReactNode,
  title?: string,
  steamUser?: PrismaSteamUser;
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
      <body className="min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        <ClientOnly>
          <Suspense>
            <div className="bg-app-bg px-5 md:px-10">
              <ThemeProvider>
                <Navbar
                  authState={steamUser ? true : false}
                  className="h-14"
                />
              </ThemeProvider>
              <main className="flex flex-col items-center justify-center w-full z-0 pt-20 pb-16 px-4 min-h-screen overflow-hidden bg-app-bg">
                {children}
              </main>
            </div>
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
  const loaderData = useLoaderData<typeof loader>();
  const steamUser = loaderData.steamUser;
  return (
    <Document steamUser={steamUser as PrismaSteamUser}>
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
            src='four-oh-four-error.svg'
            alt='Four oh four error'
          />
        )}
      </div>
    </Document>
  );
}
