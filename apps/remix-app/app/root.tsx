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
  useLoaderData,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import Navbar from '~/components/Layout/Navbar';
import type { ExtendedAppLoadContext } from './interfaces';

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
  if (data.steamUser) {
    await upsertSteamUser(data.steamUser);
  }
  return json<ExtendedAppLoadContext>(data);
}

function Document({
  children,
  title = 'Apple Silicon Gaming DB',
}: {
  children: React.ReactNode,
  title?: string,
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        {title ? <title>title</title> : null}
        <Links />
      </head>
      <body className="min-h-screen">
        {children}
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
    <Document>
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
            <main className="z-0 pt-20 pb-16 px-4 min-h-screen overflow-hidden">
              <Outlet />
            </main>
          </div>
        </Suspense>
      </ClientOnly>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  <Document title="Error">
    <div>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
    </div>
  </Document>;
}
