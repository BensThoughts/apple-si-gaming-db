import { json } from '@remix-run/node';
import type { MetaFunction } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';
import { findSteamAppsWherePostsExist, findTrendingSteamApps } from '~/models/Steam/steamApp.server';
import { findNewestPerformancePosts } from '~/models/SteamedApples/performancePost.server';
import type {
  TrendingSteamApp,
  PerformancePost,
} from '~/interfaces';

import { Fragment } from 'react';
import NewPerformancePostCard from '~/components/Cards/NewPerformancePostCard';
import TrendingSteamAppCard from '~/components/Cards/TrendingSteamAppCard';
import type { SteamAppForSmallDisplayCard } from '~/components/Cards/SmallAppsCard';
import SmallAppsCard from '~/components/Cards/SmallAppsCard';
import { metaTags } from '~/lib/meta-tags';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import CatchDisplay from '~/components/Layout/CatchDisplay';


interface LoaderData {
  trendingSteamApps: TrendingSteamApp[];
  newPerformancePosts: Omit<PerformancePost, 'postTags' | 'systemSpec' | 'numLikes'>[];
  steamAppsWherePostsExist: SteamAppForSmallDisplayCard[];
}

export async function loader() {
  const NUM_TRENDING_APPS = 10;
  const NUM_RECENT_POSTS = 15;
  const trendingSteamApps = await findTrendingSteamApps(NUM_TRENDING_APPS);
  const newPerformancePosts = await findNewestPerformancePosts(NUM_RECENT_POSTS);
  const steamAppsWherePostsExist = await findSteamAppsWherePostsExist();
  return json<LoaderData>({
    trendingSteamApps,
    steamAppsWherePostsExist,
    newPerformancePosts,
  });
}

export const meta: MetaFunction = () => {
  return { title: `${metaTags.title} - Games` };
};

export default function SteamAppIdIndexRoute() {
  const {
    trendingSteamApps,
    newPerformancePosts,
    steamAppsWherePostsExist,
  } = useLoaderData<typeof loader>();
  return (
    <PageWrapper currentRoute="/apps" title="Games">
      <div className="flex flex-col items-center gap-12 w-full mt-6">
        <SmallAppsCard steamApps={steamAppsWherePostsExist} />
        {(trendingSteamApps.length > 0) && (
          <div className="flex flex-col items-center gap-6 px-6 py-8 bg-tertiary rounded-lg shadow-md w-full max-w-2xl">
            <h2 className="text-secondary text-2xl">Top 10 Trending Apps</h2>
            <div className="flex flex-col items-center gap-4 w-full">
              {trendingSteamApps.map(({
                steamAppId,
                name,
                headerImage,
                numPerformancePosts,
              }) => (
                <Fragment key={steamAppId}>
                  <TrendingSteamAppCard
                    steamAppId={steamAppId}
                    name={name}
                    headerImage={headerImage}
                    numPerformancePosts={numPerformancePosts}
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
                performancePostId,
                createdAt,
                steamApp,
                postText,
                userWhoCreated,
                rating,
              }) => (
                <Fragment key={performancePostId}>
                  <NewPerformancePostCard
                    performancePostId={performancePostId}
                    createdAt={new Date(createdAt)}
                    steamApp={steamApp}
                    postText={postText}
                    userWhoCreated={userWhoCreated}
                    rating={rating}
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
  return <ErrorDisplay includePageWrapper error={error} currentRoute="/apps" />;
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <CatchDisplay includePageWrap thrownResponse={caught} currentRoute="/apps" />
  );
}
