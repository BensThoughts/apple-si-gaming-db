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
import type { SteamGenre } from '~/interfaces/database';
import tailwindStylesheetUrl from './styles/tailwind.css';
import { metaTags } from './lib/meta-tags';
import { extractAppLoadContext } from './lib/data-utils/appLoadContext.server';
import Navbar from '~/components/Layout/Navbar';
import { Toaster } from 'react-hot-toast';
import { findUserProfileData, updateUserOwnedApps, upsertSteamUser } from './models/steamUser.server';

import type { SerializeFrom } from '@remix-run/node';
import { getProfileSession } from './lib/sessions/profile-session.server';
import type { Theme } from './lib/context/theme-provider';
import { useTheme, ThemeProvider, NonFlashOfWrongThemeEls } from './lib/context/theme-provider';
import { getThemeSession } from './lib/sessions/theme-session.server';
// import { getBannerSession } from './lib/sessions/banner-session.server';

// import { load, trackPageview} from 'fathom-client';
// import { useEffect } from 'react';
// import { useEffect, useRef } from 'react';
import { updateNumTimesLoggedIn } from './models/siteUserStats';
import { giveUserFirstLoginAchievement } from './models/siteAchievements';
// import Fathom from './components/Fathom';

type RootLoaderData = {
  cookieData: {
    theme: Theme | null;
    banners: {
      showNewDomainBanner: boolean;
    }
  };
  steamUserData: {
    contextData: {
      isLoggedIn: boolean;
      steamUserId?: string | null;
      displayName?: string | null;
      avatarFull?: string | null,
    };
    prismaData?: {
      likedPerformancePostIds: string[];
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
  };
}

export type SerializedRootLoaderData = SerializeFrom<RootLoaderData>

export async function loader({ request, context }: LoaderArgs) {
  const host = request.headers.get('Host');
  console.log('Request Host: ' + host);
  const showNewDomainBanner =
    host?.toLowerCase().includes('localhost') ||
    host?.toLowerCase().includes('steamedapples')
    ? false
    : true;
  const themeSession = await getThemeSession(request);
  const theme = themeSession.getTheme();
  const { steamUser } = extractAppLoadContext(context);
  const isLoggedIn = steamUser ? true : false;
  const profileSession = await getProfileSession(request);

  if (steamUser) {
    const {
      steamUserId,
      displayName,
      avatarFull,
    } = steamUser;
    // Just logged in, need to add user or update user in db
    // this won't run again until user logs out and back in again
    if (!profileSession.hasAlreadyLoggedIn()) {
      await upsertSteamUser(steamUser);
      await updateUserOwnedApps(steamUser.steamUserId);
      const { numLogins } = await updateNumTimesLoggedIn(steamUser.steamUserId);
      if (numLogins === 1) {
        await giveUserFirstLoginAchievement(steamUser.steamUserId);
      }
      profileSession.setAlreadyLoggedIn(true);
    }
    const userProfile = await findUserProfileData(steamUser.steamUserId);
    if (userProfile) {
      const {
        ownedApps,
        systemSpecs,
        likedPerformancePosts,
      } = userProfile;
      const likedPerformancePostIds = likedPerformancePosts.map((performancePost) => performancePost.performancePostId);
      // const systemNames = systemSpecs.map((systemSpec) =>
      // systemSpec.systemName);
      // TODO: code for headers is duplicated before each return json()
      const headers = new Headers();
      headers.append('Set-Cookie', await profileSession.commit());
      // headers.append('Set-Cookie', await bannerSession.commit());
      return json<RootLoaderData>({
        cookieData: {
          theme,
          banners: {
            showNewDomainBanner,
          },
        },
        steamUserData: {
          contextData: {
            isLoggedIn,
            steamUserId,
            displayName,
            avatarFull,
          },
          prismaData: {
            ownedApps,
            systemSpecs,
            likedPerformancePostIds,
          },
        },
      }, {
        headers,
      });
    } else {
      // TODO: code for headers is duplicated before each return json()
      const headers = new Headers();
      headers.append('Set-Cookie', await profileSession.commit());
      // headers.append('Set-Cookie', await bannerSession.commit());
      return json<RootLoaderData>({
        cookieData: {
          theme,
          banners: {
            showNewDomainBanner,
          },
        },
        steamUserData: {
          contextData: {
            isLoggedIn,
            steamUserId,
            displayName,
            avatarFull,
          },
        },
      }, {
        headers,
      });
    }
  }
  // TODO: code for headers is duplicated before each return json()
  profileSession.unsetAlreadyLoggedIn();
  const headers = new Headers();
  headers.append('Set-Cookie', await profileSession.commit());
  // headers.append('Set-Cookie', await bannerSession.commit());
  return json<RootLoaderData>({
    cookieData: {
      theme,
      banners: {
        showNewDomainBanner,
      },
    },
    steamUserData: {
      contextData: {
        isLoggedIn,
      },
    },
  }, {
    headers,
  });
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: tailwindStylesheetUrl },
  ];
};

export const meta: MetaFunction = ({ data }) => ({
  'charset': 'utf-8',
  'viewport': 'width=device-width,initial-scale=1',
  'color-scheme': (data && data.theme === 'light') ? 'light dark' : 'dark light',
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
    cookieData: {
      theme,
    },
    steamUserData: {
      contextData: {
        isLoggedIn,
      },
    },
  }= useLoaderData<RootLoaderData>();
  const transition = useTransition();
  const isSearchSubmitting =
    transition.state === 'submitting' &&
    transition.location.pathname === '/search';
  return (
    <ThemeProvider ssrCookieTheme={theme}>
      <Document
        isLoggedIn={isLoggedIn}
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
