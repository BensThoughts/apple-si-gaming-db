import { Outlet, useCatch, useLoaderData } from '@remix-run/react';
import type { LoaderArgs, MetaFunction } from '@remix-run/server-runtime';
import { json, Response } from '@remix-run/node';

// import { getSteamAppDetailsRequest } from '~/lib/data-utils/steamApi.server';
import {
  findSteamAppByAppId,
  // updateSteamApp,
  // convertSteamApiDataToPrisma,
} from '~/models/Steam/steamApp.server';
import AppInfoTags from '~/components/Apps/AppInfo/AppInfoTags';
import AppInfoDescriptionCard from '~/components/Apps/AppInfo/AppInfoDescriptionCard';
import AppInfoHeader from '~/components/Apps/AppInfo/AppInfoHeader';
import AppInfoRequirements from '~/components/Apps/AppInfo/AppInfoRequirements';
import PageWrapper from '~/components/Layout/PageWrapper';
import { validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import type { AveragePerformancePostRating, SteamApp } from '~/interfaces';
import { logger } from '~/lib/logger/logger.server';
import FourOhFour from '~/components/Layout/FourOhFour';
import CatchDisplay from '~/components/Layout/CatchDisplay';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import AppRatingOverview from '~/components/Apps/AppInfo/AppRatingOverview';
import {
  findAverageTotalRatingsOfPerformancePosts,
} from '~/models/SteamedApples/performancePost.server';

interface LoaderData {
  steamApp: SteamApp;
  avgPerformancePostRating: AveragePerformancePostRating;
}

export async function loader({ params }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  const steamApp = await findSteamAppByAppId(steamAppId);
  const avgPerformancePostRating = await findAverageTotalRatingsOfPerformancePosts(steamAppId);

  if (!steamApp) {
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
  }
  return json<LoaderData>({
    steamApp,
    avgPerformancePostRating,
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
  const { steamApp, avgPerformancePostRating } = useLoaderData<typeof loader>();

  const {
    name,
    steamAppId,
    headerImage,
    requiredAge,
    platformLinux,
    platformMac,
    platformWindows,
    releaseDate,
    shortDescription,
    pcRequirementsMinimum,
    linuxRequirementsMinimum,
    macRequirementsMinimum,
    genres,
    categories,
  } = steamApp;
  return (
    <PageWrapper title={name} topSpacer>
      <div className="flex flex-col gap-6 items-center md:flex-row md:justify-center md:items-start w-full min-h-screen">

        <div className="flex flex-col gap-6 md:gap-3 w-full h-full items-center md:max-w-xs">
          <div className="flex flex-col gap-3 w-full">
            <AppInfoHeader
              steamAppId={steamAppId}
              name={name}
              headerImage={headerImage}
              releaseDate={releaseDate}
              platformMac={platformMac}
              platformLinux={platformLinux}
              platformWindows={platformWindows}
            />
            <AppInfoTags
              genres={genres}
              categories={categories}
            />
            <AppInfoRequirements
              mac={{ platformMac, macRequirementsMinimum }}
              windows={{ platformWindows, pcRequirementsMinimum }}
              linux={{ platformLinux, linuxRequirementsMinimum }}
            />
          </div>

          <AppRatingOverview avgPerformancePostRating={avgPerformancePostRating} />
          <div className="hidden md:block">
            <AppInfoDescriptionCard
              requiredAge={requiredAge}
              shortDescription={shortDescription}
            />
          </div>

        </div>
        <Outlet />
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
