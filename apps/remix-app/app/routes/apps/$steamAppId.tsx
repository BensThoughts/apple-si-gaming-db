import { Outlet, useCatch, useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/server-runtime';
// import { redirect } from '@remix-run/node';
import { json, Response } from '@remix-run/node';

// import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
// import { createPerformancePost } from '~/models/performancePost.server';
import { getSteamAppDetailsRequest } from '~/lib/data-utils/steamApi.server';
import {
  searchSteamAppByAppId,
  updateSteamApp,
  convertSteamApiDataToPrisma,
} from '~/models/steamApp.server';
import type { SteamCategory, SteamGenre } from '~/interfaces/database';

import AppInfoTags from '~/components/AppInfo/AppInfoTags';
// import LoadingComponent from '~/components/LoadingComponent';
import AppInfoMainAppCard from '~/components/AppInfo/AppInfoMainAppCard';
import AppInfoHeader from '~/components/AppInfo/AppInfoHeader';
import AppInfoRequirements from '~/components/AppInfo/AppInfoRequirements';
import PageWrapper from '~/components/Layout/PageWrapper';
import { validateSteamAppId } from '~/lib/loader-functions/params-validators.server';

interface LoaderData {
  steamApp: {
    steamAppId: number;
    name: string;
    headerImage: string | null;
    requiredAge: string | null;
    shortDescription: string | null;
    releaseDate: string | null;
    platformMac: boolean | null;
    platformLinux: boolean | null;
    platformWindows: boolean | null;
    pcRequirementsMinimum: string | null;
    macRequirementsMinimum: string | null;
    linuxRequirementsMinimum: string | null;
    genres: SteamGenre[];
    categories: SteamCategory[];
  };
}

export async function loader({ params }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  let steamApp = await searchSteamAppByAppId(steamAppId);
  if (!steamApp) {
    throw new Response('App Not Found!', {
      status: 404,
    });
  }
  if (!steamApp.dataDownloadAttempted || !steamApp.dataDownloaded) {
    const steamApiApp = await getSteamAppDetailsRequest(steamApp.steamAppId);
    if (steamApiApp.data) {
      const prismaSteamApp = convertSteamApiDataToPrisma(steamApiApp.data);
      await updateSteamApp(prismaSteamApp);
      steamApp = await searchSteamAppByAppId(steamAppId);
    }
    if (!steamApp) {
      throw new Response('App Not Found!', {
        status: 404,
      });
    }
  }
  return json<LoaderData>({
    steamApp,
  });
}

export default function AppsRoute() {
  const { steamApp } = useLoaderData<typeof loader>();

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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-screen">

        <div className="col-start-1 col-span-1 md:col-span-4 xl:col-span-3">
          <div className="flex flex-col gap-3 h-full items-center">
            <AppInfoHeader
              steamAppId={steamAppId}
              headerImage={headerImage}
              releaseDate={releaseDate}
              platformMac={platformMac}
              platformLinux={platformLinux}
              platformWindows={platformWindows}
            />
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
        <div className="md:col-start-5 xl:col-start-4 col-end-[-1]">
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

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <PageWrapper title="Oops!">
      <div>
        <h1>Oops! - {caught.status} - {caught.data}</h1>
        {caught.status === 404 && (
          <img
            src="/svg-images/four-oh-four-error.svg"
            alt="Four oh four error"
          />
        )}
      </div>
    </PageWrapper>
  );
}
