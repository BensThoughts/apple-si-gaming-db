import { Outlet, useCatch, useLoaderData } from '@remix-run/react';
import type { LoaderArgs, MetaFunction } from '@remix-run/server-runtime';
import { json, Response } from '@remix-run/node';

// import { getSteamAppDetailsRequest } from '~/lib/data-utils/steamApi.server';
import {
  findSteamAppByAppId,
  // updateSteamApp,
  // convertSteamApiDataToPrisma,
} from '~/models/Steam/steamApp.server';
import AppInfoTags from '~/components/AppInfo/AppInfoTags';
import AppInfoMainAppCard from '~/components/AppInfo/AppInfoMainAppCard';
import AppInfoHeader from '~/components/AppInfo/AppInfoHeader';
import AppInfoRequirements from '~/components/AppInfo/AppInfoRequirements';
import PageWrapper from '~/components/Layout/PageWrapper';
import { validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import type { SteamAppSidebarData } from '~/interfaces';
import { logger } from '~/lib/logger/logger.server';
import FourOhFour from '~/components/Layout/FourOhFour';
import CatchDisplay from '~/components/Layout/CatchDisplay';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';

interface LoaderData {
  steamApp: SteamAppSidebarData;
}

function isMoreThanDaysAgo(dateToTest: Date, daysAgo: number) {
  //                   days  hours min  sec  ms
  const daysAgoInMs = daysAgo * 24 * 60 * 60 * 1000;
  const timestampDaysAgo = new Date().getTime() - daysAgoInMs;

  if (timestampDaysAgo > dateToTest.getTime()) {
    return true;
  } else {
    return false;
  }
}

export async function loader({ params }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  const steamApp = await findSteamAppByAppId(steamAppId);
  const throwSteamAppError = () => {
    logger.debug(`steam app with steamAppId ${steamAppId} not found in db`, {
      metadata: {
        steamApp: {
          steamAppId,
        },
      },
    });
    throw new Response(`Steam app with appid ${steamAppId} not found in database!`, {
      status: 404,
    });
  };
  if (!steamApp) {
    throw throwSteamAppError();
  }
  const DAYS_TILL_STALE_DATA = 7;
  if (
    !steamApp.dataDownloadAttempted ||
    !steamApp.dataDownloaded ||
    (
      steamApp.dataDownloadAttemptedAt &&
      isMoreThanDaysAgo(steamApp.dataDownloadAttemptedAt, DAYS_TILL_STALE_DATA)
    )
  ) {
    logger.info(
        `stale data for steam app with steamAppId ${steamAppId} found, last dataDownloadAttemptedAt is more than ${DAYS_TILL_STALE_DATA} days old for ${steamApp.name}`, {
          metadata: {
            steamApp: {
              steamAppId,
              name: steamApp.name,
            },
            extra: {
              dataDownloadAttemptedAt: steamApp.dataDownloadAttemptedAt,
            },
          },
        },
    );
    // const steamApiApp = await getSteamAppDetailsRequest(steamApp.steamAppId);
    // if (steamApiApp.data) {
    //   const prismaSteamApp = convertSteamApiDataToPrisma(steamApiApp.data);
    //   // TODO: Performing these updates in a loader doesn't work when
    //   // TODO: the fly app is not in primary region, ALL mutations need to
    //   // TODO: somehow move to an action
    //   await updateSteamApp(prismaSteamApp);
    //   steamApp = await findSteamAppByAppId(steamAppId);
    // }
    // if (!steamApp) {
    //   throw throwSteamAppError();
    // }
  }
  return json<LoaderData>({
    steamApp,
  });
}

export const meta: MetaFunction<LoaderData> = ({
  data,
}: {
  data?: Partial<LoaderData>;
}) => {
  if (data && data.steamApp) {
    return {
      title: `${data.steamApp.name} - Apple Silicon Compatibility and Performance Reviews`,
    };
  }
  return { title: 'Apple Silicon Compatibility and Performance Reviews' };
};

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
    <PageWrapper currentRoute={`/apps/${steamAppId}/posts`} title={name} topSpacer>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-screen">

        <div className="col-start-1 col-span-1 md:col-span-4 xl:col-span-3">
          <div className="flex flex-col gap-3 h-full items-center">
            <AppInfoHeader
              steamAppId={steamAppId}
              name={name}
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
  return <ErrorDisplay includePageWrapper error={error} currentRoute="/apps" />;
}

export function CatchBoundary() {
  const caught = useCatch();
  if (caught.status === 404) {
    return (
      <FourOhFour currentRoute="/apps">
        {caught.status}: {caught.statusText} - {caught.data}
      </FourOhFour>
    );
  }
  return (
    <CatchDisplay includePageWrap thrownResponse={caught} currentRoute="/apps" />
  );
}
