import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { findLatestPerformancePosts } from '~/models/performancePost.server';
import { findTrendingSteamApps } from '~/models/steamApp.server';
import type { TrendingSteamApp } from '~/models/steamApp.server';
import PageWrapper from '~/components/Layout/PageWrapper';
import TrendingSteamAppCard from '~/components/Cards/TrendingSteamAppCard';
import { Fragment } from 'react';
import type { FrameRate, RatingMedal } from '~/interfaces/database';
import NewPerformancePostCard from '~/components/Cards/NewPerformancePostCard';

interface LoaderData {
  trendingSteamApps: TrendingSteamApp[];
  newPerformancePosts: {
    id: string;
    steamAppId: number;
    steamApp: {
      name: string;
      headerImage: string | null;
    };
    postText: string;
    postTags: {
      postTagId: number;
      description: string;
    }[]
    displayName: string | null;
    avatarMedium: string | null;
    ratingMedal: RatingMedal;
    frameRateAverage: FrameRate | null;
    frameRateStutters: boolean | null;
    createdAt: Date;
  }[]
}

const NUM_TRENDING_APPS = 15;

export async function loader() {
  const trendingSteamApps = await findTrendingSteamApps(NUM_TRENDING_APPS);
  const newPerformancePosts = await findLatestPerformancePosts(5);
  return json<LoaderData>({
    trendingSteamApps,
    newPerformancePosts,
  });
}

export default function IndexRoute() {
  const { trendingSteamApps, newPerformancePosts } = useLoaderData<typeof loader>();
  return (
    <PageWrapper>
      <div className="relative sm:flex sm:items-center sm:justify-center">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-20">
            <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
              <span className="block uppercase text-primary-highlight drop-shadow-md">
                Apple Silicon on Steam
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-center text-xl text-primary sm:max-w-3xl">
                Read and write user experience reports about steam games running on apple silicon from users verified to own the game.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-12 w-full">
        {(trendingSteamApps.length > 0) && (
          <div className="flex flex-col items-center gap-6 w-full">
            <h2 className="text-secondary text-2xl">Trending Apps</h2>
            <div className="flex flex-col items-center gap-2 w-full max-w-md">
              {trendingSteamApps.map(({
                steamAppId,
                name,
                headerImage,
                releaseDate,
                _count,
              }) => (
                <Fragment key={steamAppId}>
                  <TrendingSteamAppCard
                    steamAppId={steamAppId}
                    name={name}
                    headerImage={headerImage}
                    releaseDate={releaseDate}
                    numNewPerformancePosts={_count.performancePosts}
                  />
                </Fragment>
              ))}
            </div>
          </div>
        )}
        {(newPerformancePosts.length > 0) && (
          <div className="flex flex-col items-center gap-6 w-full">
            <h2 className="text-secondary text-2xl">New Posts</h2>
            <div className="w-full flex flex-col items-center gap-2">
              {newPerformancePosts.map(({
                id,
                steamAppId,
                steamApp,
                postText,
                postTags,
                displayName,
                avatarMedium,
                ratingMedal,
                createdAt,
              }) => (
                <Fragment key={id}>
                  <NewPerformancePostCard
                    steamAppId={steamAppId}
                    steamApp={steamApp}
                    postText={postText}
                    displayName={displayName}
                    avatarMedium={avatarMedium}
                    ratingMedal={ratingMedal}
                    createdAt={new Date(createdAt)}
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
