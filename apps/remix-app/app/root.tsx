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
  // useLocation,
  useTransition,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import globalStylesheetUrl from '~/styles/global.css';
import { metaTags } from '~/lib/meta-tags';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import Navbar from '~/components/Layout/Navbar';
import { Toaster } from 'react-hot-toast';
import {
  findUserSessionByUserProfileId,
  upsertUserProfileBySteamUserId64,
} from '~/models/SteamedApples/userProfile.server';
import {
  updateSteamUserProfileOwnedSteamApps,
} from '~/models/Steam/steamUserProfile.server';

import type { SerializeFrom } from '@remix-run/node';
import { getProfileSession, logout } from '~/lib/sessions/profile-session.server';
// import { getBannerSession } from '~/lib/sessions/banner-session.server';
import type { Theme } from '~/lib/context/theme-provider';
import { useTheme, ThemeProvider, NonFlashOfWrongThemeEls } from '~/lib/context/theme-provider';
import { getThemeSession } from '~/lib/sessions/theme-session.server';
import type {
  UserSessionServerSide,
} from '~/interfaces/remix-app/UserSession';
import { getBannerSession } from './lib/sessions/banner-session.server';
import logger from '~/lib/logger/logger.server';

type RootLoaderData = {
  theme: Theme | null;
  userSession?: UserSessionServerSide;
}

export type SerializedRootLoaderData = SerializeFrom<RootLoaderData>

export async function loader({ request, context }: LoaderArgs) {
  const bannerSession = await getBannerSession(request);
  const themeSession = await getThemeSession(request);
  const theme = themeSession.getTheme();

  const { steamUser } = extractAppLoadContext(context);
  const profileSession = await getProfileSession(request);

  if (steamUser) { // if steamUser then isLoggedInWithSteam = true
    const steamUserId64 = steamUser.steamUserId64;
    let userProfileId = profileSession.getUserProfileId(); // are we logged in to SteamedApples?
    if (!userProfileId) { // Upon initial login we don't have userProfileId yet
      const { id } = await upsertUserProfileBySteamUserId64(steamUserId64, steamUser);
      userProfileId = id;
      await updateSteamUserProfileOwnedSteamApps(steamUserId64);
      // TODO: "It's important that you logout (or perform any mutation for that
      // TODO: matter) in an action"
      // TODO: "When using session.unset(), you need to be sure no
      // TODO: other loaders in the request are going to want to read that"
      // TODO: https://remix.run/docs/en/v1/utils/sessions
      profileSession.login(userProfileId, steamUserId64);
    }
    // We are now definitely logged in and have a userProfileId
    const userSession = await findUserSessionByUserProfileId(userProfileId);
    if (!userSession) {
      logger.warn(`logging out user because they were not found in db. steamUserId64: ${steamUserId64}`, {
        metadata: {
          userSession: {
            userProfile: {
              userProfileId,
            },
            steamUserProfile: {
              steamUserId: steamUserId64,
            },
          },
        },
      });
      throw await logout(request);
    }

    logger.debug(`steam user with steamUserId64 ${steamUserId64} just logged in`, {
      metadata: {
        userSession: {
          userProfile: {
            userProfileId,
          },
          steamUserProfile: {
            steamUserId: steamUserId64,
          },
        },
      },
    });

    const headers = new Headers();
    // TODO: code for headers is duplicated before each return json()
    headers.append('Set-Cookie', await profileSession.commit());

    // TODO: destroying all banner sessions for now 03/04/2023
    headers.append('Set-Cookie', await bannerSession.destroy());
    // headers.append('Set-Cookie', await bannerSession.commit());
    return json<RootLoaderData>({
      theme,
      userSession,
    }, {
      headers,
    });
  }

  // TODO: code for headers is duplicated before each return json()
  const headers = new Headers();

  // TODO: destroying all banner sessions for now 03/04/2023
  headers.append('Set-Cookie', await bannerSession.destroy());
  return json<RootLoaderData>({
    theme,
  }, {
    headers,
  });
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStylesheetUrl },
  ];
};

export const meta: MetaFunction = ({ data }: {
  data?: Partial<RootLoaderData>;
}) => ({
  'charset': 'utf-8',
  'viewport': 'width=device-width,initial-scale=1',
  'color-scheme': (data?.theme === 'light') ? 'light dark' : 'dark light',
  ...metaTags,
});

function Document({
  children,
  title,
  isLoggedIn,
  isSearchSubmitting,
  ssrTheme,
}: {
  children: React.ReactNode;
  title?: string;
  isLoggedIn?: boolean;
  isSearchSubmitting?: boolean;
  ssrTheme: Theme | null;
}) {
  const [theme] = useTheme();

  // const fathomLoaded = useRef(false);
  // const location = useLocation();

  // useEffect(function setupFathom() {
  //   if (!fathomLoaded.current) {
  //     Fathom.load('OXJZWIXK', {
  //       url: 'https://outstanding-phone.steamedapples.com/script.js',
  //       includedDomains: [
  //         'www.steamedapples.com',
  //         'steamedapples.com',
  //         '*.steamedapples.com',
  //         'www.applesilicongaming.com',
  //         'applesilicongaming.com',
  //         '*.applesilicongaming.com',
  //       ],
  //     });
  //     fathomLoaded.current = true;
  //   } else {
  //     Fathom.trackPageview({ url: location.pathname + location.search });
  //   }
  // }, [location]);

  return (
    <html
      lang="en"
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
    >
      <head>
        {title ? <title>{title}</title> : null}
        <script src="https://outstanding-phone.steamedapples.com/script.js" data-spa="auto" data-site="OXJZWIXK" defer></script>
        <Meta />
        <Links />
      </head>
      <body
        className="min-h-screen bg-app-bg"
        data-theme={theme ? theme : ''}
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      >
        {/* <Fathom /> */}
        <Navbar
          isLoggedIn={isLoggedIn ? isLoggedIn : false}
          isSearchSubmitting={isSearchSubmitting ? isSearchSubmitting : false}
          className="h-14"
        />
        <div className="absolute top-14 w-full z-10">
          {children}
        </div>
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(ssrTheme)} />
        <Toaster />
        <ScrollRestoration />
        {/* <script src="https://cdn.usefathom.com/script.js" data-spa="auto" data-site="OXJZWIXK" defer /> */}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  // TODO: Getting cannot use loaderData in an error boundary errors,
  // TODO: with error being thrown on /profile, prob. because of this
  const {
    theme,
    userSession,
  }= useLoaderData<RootLoaderData>();
  const transition = useTransition();
  const isSearchSubmitting =
    transition.state === 'submitting' &&
    transition.location.pathname === '/search';
  return (
    <ThemeProvider ssrCookieTheme={theme}>
      <Document
        isLoggedIn={userSession ? true : false}
        isSearchSubmitting={isSearchSubmitting}
        ssrTheme={theme}
      >
        <Outlet />
      </Document>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ThemeProvider ssrCookieTheme={null}>
      <Document title={`${metaTags.title} - Error`} ssrTheme={null}>
        <div>
          <h1>Main App Error</h1>
          <pre>{error.message}</pre>
        </div>
      </Document>
    </ThemeProvider>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <ThemeProvider ssrCookieTheme={null}>
      <Document title={`${metaTags.title} - Oops!`} ssrTheme={null}>
        <div>
          <h1>Oops! - {caught.status} {caught.statusText}</h1>
        </div>
      </Document>
    </ThemeProvider>
  );
}
