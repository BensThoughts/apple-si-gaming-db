import { json } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';
import { findTrendingSteamApps } from '~/models/steamApp.server';
import { findNewestPerformancePosts } from '~/models/steamPerformancePost.server';
import type { TrendingSteamApp, PerformancePostBrief } from '~/interfaces';

import { Fragment } from 'react';
import NewPerformancePostCard from '~/components/Cards/NewPerformancePostCard';
import TrendingSteamAppCard from '~/components/Cards/TrendingSteamAppCard';

interface LoaderData {
  trendingSteamApps: TrendingSteamApp[];
  newPerformancePosts: PerformancePostBrief[];
}

export async function loader() {
  const NUM_TRENDING_APPS = 10;
  const NUM_RECENT_POSTS = 15;
  const trendingSteamApps = await findTrendingSteamApps(NUM_TRENDING_APPS);
  const newPerformancePosts = await findNewestPerformancePosts(NUM_RECENT_POSTS);
  return json<LoaderData>({
    trendingSteamApps,
    newPerformancePosts,
  });
}

export default function SteamAppIdIndexRoute() {
  const { trendingSteamApps, newPerformancePosts } = useLoaderData<typeof loader>();
  return (
    <PageWrapper currentRoute="/apps">
      <div className="flex flex-col items-center gap-12 w-full mt-6">
        {(trendingSteamApps.length > 0) && (
          <div className="flex flex-col items-center gap-6 px-6 py-8 bg-tertiary rounded-lg shadow-md w-full max-w-2xl">
            <h2 className="text-secondary text-2xl">Top 10 Trending Apps</h2>
            <div className="flex flex-col items-center gap-4 w-full">
              {trendingSteamApps.map(({
                steamAppId,
                name,
                headerImage,
                _count,
              }) => (
                <Fragment key={steamAppId}>
                  <TrendingSteamAppCard
                    steamAppId={steamAppId}
                    name={name}
                    headerImage={headerImage}
                    numNewPerformancePosts={_count.performancePosts}
                  />
                </Fragment>
              ))}
            </div>
          </div>
        )}
        {(newPerformancePosts.length > 0) && (
          <div className="flex flex-col items-center gap-6 px-6 py-8 bg-tertiary rounded-lg shadow-md w-full max-w-2xl">
            <h2 className="text-secondary text-2xl">Top 15 New Posts</h2>
            <div className="w-full flex flex-col items-center gap-4">
              {newPerformancePosts.map(({
                id,
                steamAppId,
                steamApp,
                postText,
                displayName,
                avatarMedium,
                ratingMedal,
              }) => (
                <Fragment key={id}>
                  <NewPerformancePostCard
                    steamAppId={steamAppId}
                    steamApp={steamApp}
                    postText={postText}
                    displayName={displayName}
                    avatarMedium={avatarMedium}
                    ratingMedal={ratingMedal}
                  />
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <PageWrapper currentRoute="/apps" topSpacer>
      <div>
        <h1>Error in /apps route</h1>
        <div>{error.message}</div>
      </div>
    </PageWrapper>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <PageWrapper currentRoute="/apps" title="Oops!" topSpacer>
      <div>
        <h1>Oops! - {caught.status} - {caught.data}</h1>
        <p>Error in /apps/index route</p>
      </div>
    </PageWrapper>
  );
}
