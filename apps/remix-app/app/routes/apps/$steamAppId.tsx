import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/server-runtime';
// import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';

// import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
// import { createPerformancePost } from '~/models/performancePost.server';
import { getSteamAppDetailsRequest } from '~/lib/data-utils/steamApi.server';
import {
  searchSteamAppByAppId,
  updateSteamApp,
  convertSteamApiDataToPrisma,
} from '~/models/steamApp.server';

import AppInfoTags from '~/components/AppInfo/Tags';
import ExternalLinks from '~/components/AppInfo/ExternalLinks';
// import LoadingComponent from '~/components/LoadingComponent';
import MainAppCard from '~/components/AppInfo/MainAppCard';
import AppInfoTabs from '~/components/AppInfo/AppInfoTabs';
import AppInfoDisclosure from '~/components/AppInfo/AppInfoDisclosure';
import AppInfoHeader from '~/components/AppInfo/AppInfoHeader';

export async function loader({ params }: LoaderArgs) {
  invariant(params.steamAppId, 'Expected params.steamAppId');
  const steamAppId = Number(params.steamAppId);
  invariant(isFinite(steamAppId), 'Expected steamAppId to be a valid number');
  let steamApp = await searchSteamAppByAppId(steamAppId);
  if (steamApp && (!steamApp?.dataDownloadAttempted || !steamApp?.dataDownloaded)) {
    const steamApiApp = await getSteamAppDetailsRequest(steamApp.steamAppId);
    if (steamApiApp.data) {
      const prismaSteamApp = convertSteamApiDataToPrisma(steamApiApp.data);
      await updateSteamApp(prismaSteamApp);
      steamApp = await searchSteamAppByAppId(steamAppId);
    }
  }
  return json({
    steamApp,
  });
}

export default function AppsRoute() {
  const { steamApp } = useLoaderData<typeof loader>();

  if (!steamApp) {
    return (
      <div>
        No App Found
      </div>
    );
  }
  const {
    name,
    steamAppId,
    headerImage,
    requiredAge,
    platformLinux,
    platformMac,
    platformWindows,
    // controllerSupport,
    releaseDate,
    shortDescription,
    pcRequirementsMinimum,
    linuxRequirementsMinimum,
    macRequirementsMinimum,
    genres,
    categories,
  } = steamApp;
  return (
    <div className="h-full">
      <div className="w-full h-12 flex items-center bg-primary rounded-lg py-4 px-6 mb-3">
        <h1 className="text-3xl md:text-4xl text-left text-secondary">
          {name}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-screen">

        <div className="col-start-1 col-span-1">
          <div className="flex flex-col gap-3 h-full items-center">
            <AppInfoHeader
              headerImage={headerImage}
              releaseDate={releaseDate}
              platformMac={platformMac}
              platformLinux={platformLinux}
              platformWindows={platformWindows}
            />
            <ExternalLinks steamAppId={steamAppId} />
            {((genres.length > 0) || (categories.length > 0)) &&
              <div className="w-full max-w-2xl">
                <AppInfoTags
                  genres={genres}
                  categories={categories}
                />
              </div>
            }
            {(
              (macRequirementsMinimum && platformMac) ||
              (pcRequirementsMinimum && platformWindows) ||
              (linuxRequirementsMinimum && platformLinux)
            ) && (
              <div className="w-full max-w-2xl">
                <AppInfoDisclosure title="Requirements">
                  <AppInfoTabs
                    mac={{ platformMac, macRequirementsMinimum }}
                    windows={{ platformWindows, pcRequirementsMinimum }}
                    linux={{ platformLinux, linuxRequirementsMinimum }}
                  />
                </AppInfoDisclosure>
              </div>
            )}
            {shortDescription &&
              <div>
                <MainAppCard
                  requiredAge={requiredAge}
                  shortDescription={shortDescription}
                />
              </div>
            }
          </div>
        </div>
        <div className="md:col-start-2 md:col-span-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Error in /apps route</h1>
      <div>{error.message}</div>
    </div>
  );
}
