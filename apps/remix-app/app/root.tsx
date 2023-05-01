import type {
  LinksFunction,
  LoaderArgs,
  MetaFunction,
  ActionArgs,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useFetcher,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import globalStylesheetUrl from '~/styles/global.css';
import { metaTags } from '~/lib/meta-tags';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import NavBar from '~/components/Layout/Navbar';
import { Toaster } from 'react-hot-toast';
import {
  findUserSessionBySteamUserId64,
  // findUserSessionByUserProfileId,
  upsertUserProfileBySteamUserId64,
} from '~/models/SteamedApples/userProfile.server';

import type { SerializeFrom } from '@remix-run/node';
import { getProfileSession, logout } from '~/lib/sessions/profile-session.server';
// import { getBannerSession } from '~/lib/sessions/banner-session.server';
import { Theme } from '~/lib/context/theme-provider';
import { useTheme, ThemeProvider, NonFlashOfWrongThemeEls } from '~/lib/context/theme-provider';
import { getThemeSession } from '~/lib/sessions/theme-session.server';
import type {
  UserSessionServerSide,
} from '~/types/remix-app/UserSession';
import { logger } from '~/lib/logger/logger.server';
import { useEffect } from 'react';
import CatchDisplay from './components/Layout/CatchDisplay';
import ErrorDisplay from './components/Layout/ErrorDisplay';
import { updateSteamUserProfileOwnedSteamApps } from './models/Steam/steamUserProfile.server';
import { classNames } from './lib/css/classNames';

type RootLoaderData = {
  theme: Theme | null;
  isLoggedInWithSteam: boolean;
  isLoggedInToSite: boolean;
} & UserSessionServerSide;

export type SerializedRootLoaderData = SerializeFrom<RootLoaderData>


export async function loader({ request, context }: LoaderArgs) {
  const themeSession = await getThemeSession(request);
  const theme = themeSession.getTheme();

  const { steamUser } = extractAppLoadContext(context);
  const profileSession = await getProfileSession(request);

  // TODO: add check for userProfileId without steamUser and logout if case

  if (steamUser) { // if steamUser then isLoggedInWithSteam = true
    const steamUserId64 = steamUser.steamUserId64;
    const userProfileId = profileSession.getUserProfileId(); // are we logged in to SteamedApples?
    if (!userProfileId) { // Upon initial login we don't have userProfileId yet
      return json<RootLoaderData>({
        theme,
        isLoggedInWithSteam: true,
        isLoggedInToSite: false,
      });
    }
    // We are now definitely logged in and have a userProfileId
    // const userSession = await findUserSessionByUserProfileId(userProfileId);
    const userSessionFromDB = await findUserSessionBySteamUserId64(steamUserId64);

    // TODO: not sure if this is safe
    if (!userSessionFromDB) {
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
      // TODO: not sure if this is safe
      throw await logout(request);
    }

    const { userSession } = userSessionFromDB;

    return json<RootLoaderData>({
      theme,
      userSession,
      isLoggedInWithSteam: true,
      isLoggedInToSite: true,
    });
  }
  return json<RootLoaderData>({
    theme,
    isLoggedInWithSteam: false,
    isLoggedInToSite: false,
  });
}

export async function action({ request, context }: ActionArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (!steamUser) {
    throw new Response('failed login attempt, steam user not found in app context', { status: 401 });
  }
  const profileSession = await getProfileSession(request);
  const steamUserId64 = steamUser.steamUserId64;
  const { id: userProfileId } = await upsertUserProfileBySteamUserId64(steamUserId64, steamUser);
  const { success } = await updateSteamUserProfileOwnedSteamApps(steamUserId64);
  logger.debug(`steam user with steamUserId64 ${steamUserId64} attempt to update owned games, success: ${success}`);
  profileSession.login(userProfileId, steamUserId64);
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
  return json(null, {
    headers: {
      'Set-Cookie': await profileSession.commit(),
    },
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
        className={classNames(
            'min-h-screen bg-app-bg max-w-[100vw] overflow-x-hidden',
            theme && theme === Theme.DARK ? 'dark' : '',
        )}
        data-theme={theme ? theme : ''}
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      >
        {/* <Fathom /> */}
        <NavBar
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
    isLoggedInWithSteam,
    isLoggedInToSite,
  } = useLoaderData<typeof loader>();
  const shouldLogUserIntoSite = isLoggedInWithSteam && !isLoggedInToSite;

  const fetcher = useFetcher();
  const navigation = useNavigation();

  useEffect(() => {
    if (shouldLogUserIntoSite &&
        fetcher.state === 'idle' &&
        !fetcher.data
    ) {
      fetcher.submit(null, { action: '/', method: 'post' });
    }
  }, [shouldLogUserIntoSite, fetcher]);

  const isSearchSubmitting =
    navigation.state === 'loading' &&
    navigation.location.pathname === '/search';

  return (
    <ThemeProvider ssrCookieTheme={theme}>
      <Document
        // isLoggedIn={userSession ? true : false}
        // everywhere else in the app we determine if the user is logged
        // in by determining if the userProfileId and
        // steamUserId exists. We only use this here to have
        // the navigation bar prematurely update to show
        // isLoggedIn before the action at /actions/login
        // finishes setting up the user in the database
        // this way if there is an error, the user can still
        // logout of steam
        isLoggedIn={isLoggedInWithSteam}
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
        <ErrorDisplay includePageWrapper error={error} currentRoute="/" />
      </Document>
    </ThemeProvider>
  );
}

export function CatchBoundary() {
  const thrownResponse = useCatch();
  return (
    <ThemeProvider ssrCookieTheme={null}>
      <Document title={`${metaTags.title} - Oops!`} ssrTheme={null}>
        <CatchDisplay includePageWrap thrownResponse={thrownResponse} currentRoute="/" />
      </Document>
    </ThemeProvider>
  );
}
