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

import AppInfoTags from '~/components/AppInfo/AppInfoTags';
import AppInfoExternalLinks from '~/components/AppInfo/AppInfoExternalLinks';
// import LoadingComponent from '~/components/LoadingComponent';
import AppInfoMainAppCard from '~/components/AppInfo/AppInfoMainAppCard';
import AppInfoHeader from '~/components/AppInfo/AppInfoHeader';
import AppInfoRequirements from '~/components/AppInfo/AppInfoRequirements';
import PageWrapper from '~/components/Layout/PageWrapper';

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
    <PageWrapper title={name}>
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
            <AppInfoExternalLinks steamAppId={steamAppId} />
            {((genres.length > 0) || (categories.length > 0)) &&
                <AppInfoTags
                  genres={genres}
                  categories={categories}
                />
            }
            {(
              (macRequirementsMinimum && platformMac) ||
              (pcRequirementsMinimum && platformWindows) ||
              (linuxRequirementsMinimum && platformLinux)
            ) && (
              <AppInfoRequirements
                mac={{ platformMac, macRequirementsMinimum }}
                windows={{ platformWindows, pcRequirementsMinimum }}
                linux={{ platformLinux, linuxRequirementsMinimum }}
              />
            )}
            {shortDescription &&
                <AppInfoMainAppCard
                  requiredAge={requiredAge}
                  shortDescription={shortDescription}
                />
            }
          </div>
        </div>
        <div className="md:col-start-2 md:col-span-2">
          <Outlet />
        </div>
      </div>

    </PageWrapper>
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
