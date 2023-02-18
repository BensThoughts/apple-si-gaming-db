import { json } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';
import { findSteamAppsWherePostsExist, findTrendingSteamApps } from '~/models/steamApp.server';
import { findNewestPerformancePosts } from '~/models/steamPerformancePost.server';
import type {
  TrendingSteamApp,
  PerformancePostBase,
  PerformancePostSteamApp,
  PerformancePostRating,
  PerformancePostUserWhoCreated,
} from '~/interfaces';

import { Fragment } from 'react';
import NewPerformancePostCard from '~/components/Cards/NewPerformancePostCard';
import TrendingSteamAppCard from '~/components/Cards/TrendingSteamAppCard';
import type { SteamAppForSmallDisplayCard } from '~/components/Cards/SmallAppsCard';
import SmallAppsCard from '~/components/Cards/SmallAppsCard';

interface LoaderData {
  trendingSteamApps: TrendingSteamApp[];
  newPerformancePosts: (PerformancePostBase & {
    steamApp: PerformancePostSteamApp;
    rating: PerformancePostRating;
    userWhoCreatedPost: PerformancePostUserWhoCreated;
  })[];
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
    newPerformancePosts: newPerformancePosts.map(({
      id,
      createdAt,
      postText,
      steamApp: {
        steamAppId,
        name,
      },
      ratingMedal,
      steamUserId,
      displayName,
      avatarMedium,
    }) => ({
      postId: id,
      createdAt,
      postText,
      steamApp: {
        steamAppId,
        name,
      },
      rating: {
        ratingMedal,
      },
      userWhoCreatedPost: {
        steamUserId,
        displayName,
        avatarMedium,
      },
    })),
  });
}

export default function SteamAppIdIndexRoute() {
  const {
    trendingSteamApps,
    newPerformancePosts,
    steamAppsWherePostsExist,
  } = useLoaderData<typeof loader>();
  return (
    <PageWrapper currentRoute="/apps">
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
                postId,
                createdAt,
                steamApp,
                postText,
                userWhoCreatedPost,
                rating,
              }) => (
                <Fragment key={postId}>
                  <NewPerformancePostCard
                    postId={postId}
                    createdAt={new Date(createdAt)}
                    steamApp={steamApp}
                    postText={postText}
                    userWhoCreatedPost={userWhoCreatedPost}
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
