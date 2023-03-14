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
  useActionData,
  useCatch,
  useFetcher,
  useLoaderData,
  // useLocation,
  useTransition,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import globalStylesheetUrl from '~/styles/global.css';
import { metaTags } from '~/lib/meta-tags';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import NavBar from '~/components/Layout/Navbar';
import { Toaster } from 'react-hot-toast';
import {
  findUserSessionByUserProfileId, upsertUserProfileBySteamUserId64,
} from '~/models/SteamedApples/userProfile.server';

import type { SerializeFrom } from '@remix-run/node';
import { getProfileSession, logout } from '~/lib/sessions/profile-session.server';
// import { getBannerSession } from '~/lib/sessions/banner-session.server';
import type { Theme } from '~/lib/context/theme-provider';
import { useTheme, ThemeProvider, NonFlashOfWrongThemeEls } from '~/lib/context/theme-provider';
import { getThemeSession } from '~/lib/sessions/theme-session.server';
import type {
  UserSessionServerSide,
} from '~/interfaces/remix-app/UserSession';
import { logger } from '~/lib/logger/logger.server';
import { useEffect } from 'react';
import CatchDisplay from './components/Layout/CatchDisplay';
import ErrorDisplay from './components/Layout/ErrorDisplay';
import { updateSteamUserProfileOwnedSteamApps } from './models/Steam/steamUserProfile.server';

type RootLoaderData = {
  theme: Theme | null;
  userSession?: UserSessionServerSide;
  isLoggedInWithSteam: boolean;
  isLoggedInToSite: boolean;
}

export type SerializedRootLoaderData = SerializeFrom<RootLoaderData>


export async function loader({ request, context }: LoaderArgs) {
  const themeSession = await getThemeSession(request);
  const theme = themeSession.getTheme();

  const { steamUser } = extractAppLoadContext(context);
  const profileSession = await getProfileSession(request);

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
    const userSession = await findUserSessionByUserProfileId(userProfileId);

    // TODO: not sure if this is safe
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
      // TODO: not sure if this is safe
      throw await logout(request);
    }

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

export type LoginActionData = {
  successfullyLoggedInToSite: boolean;
}

export async function action({ request, context }: ActionArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (!steamUser) {
    throw new Response('steam user not found in app context', { status: 401 });
  }
  const profileSession = await getProfileSession(request);
  const steamUserId64 = steamUser.steamUserId64;
  const { id: userProfileId } = await upsertUserProfileBySteamUserId64(steamUserId64, steamUser);
  await updateSteamUserProfileOwnedSteamApps(steamUserId64);
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
  return json<LoginActionData>({
    successfullyLoggedInToSite: true,
  }, {
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
  let shouldLogUserIntoSite = isLoggedInWithSteam && !isLoggedInToSite;

  const actionData = useActionData<typeof action>();
  if (actionData) {
    const { successfullyLoggedInToSite } = actionData;
    shouldLogUserIntoSite = !successfullyLoggedInToSite;
  }

  const fetcher = useFetcher();
  const transition = useTransition();

  useEffect(() => {
    if (shouldLogUserIntoSite &&
        fetcher.state === 'idle' &&
        transition.state === 'idle'
    ) {
      fetcher.submit({}, { action: '/', method: 'post' });
    }
  }, [shouldLogUserIntoSite, fetcher, transition]);

  const isSearchSubmitting =
    transition.state === 'submitting' &&
    transition.location.pathname === '/search';
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
        <ErrorDisplay error={error} currentRoute="/" />
      </Document>
    </ThemeProvider>
  );
}

export function CatchBoundary() {
  const thrownResponse = useCatch();
  return (
    <ThemeProvider ssrCookieTheme={null}>
      <Document title={`${metaTags.title} - Oops!`} ssrTheme={null}>
        <CatchDisplay thrownResponse={thrownResponse} currentRoute="/" />
      </Document>
    </ThemeProvider>
  );
}
