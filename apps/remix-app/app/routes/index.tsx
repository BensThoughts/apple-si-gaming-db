import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { findTrendingSteamApps } from '~/models/performancePost.server';
import type { TrendingSteamApp } from '~/models/performancePost.server';
import PageWrapper from '~/components/Layout/PageWrapper';
import TrendingSteamAppCard from '~/components/Cards/TrendingSteamAppCard';
import { Fragment } from 'react';

interface LoaderData {
  trendingSteamApps: TrendingSteamApp[];
}

export async function loader() {
  const trendingSteamApps = await findTrendingSteamApps(5);
  return json<LoaderData>({
    trendingSteamApps,
  });
}

export default function IndexRoute() {
  const { trendingSteamApps } = useLoaderData<typeof loader>();
  return (
    <PageWrapper>
      <div className="relative sm:flex sm:items-center sm:justify-center">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32">
            <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
              <span className="block uppercase text-primary-highlight drop-shadow-md">
                  Apple Silicon on Steam
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-center text-xl text-primary sm:max-w-3xl">
                Write and read user experience reports about steam games running on apple silicon from users verified to own the game.
            </p>
          </div>
        </div>
      </div>
      {(trendingSteamApps.length > 0) && (
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-secondary text-2xl">Trending Apps</h2>
          <div className="flex flex-col items-center gap-2 w-full max-w-md">
            {trendingSteamApps.map(({
              steamAppId,
              name,
              headerImage,
              releaseDate,
              numNewPerformancePosts,
            }) => (
              <Fragment key={steamAppId}>
                <TrendingSteamAppCard
                  steamAppId={steamAppId}
                  name={name}
                  headerImage={headerImage}
                  releaseDate={releaseDate}
                  numNewPerformancePosts={numNewPerformancePosts}
                />
              </Fragment>
            ))}
          </div>
        </div>
      )}
      <div>

      </div>
    </PageWrapper>
  );
}
