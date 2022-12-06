import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { findNewestPerformancePosts } from '~/models/steamPerformancePost.server';
import { findTrendingSteamApps } from '~/models/steamApp.server';
import PageWrapper from '~/components/Layout/PageWrapper';
import TrendingSteamAppCard from '~/components/Cards/TrendingSteamAppCard';
import { Fragment } from 'react';
import type { TrendingSteamApp, PerformancePostBrief } from '~/interfaces';
import NewPerformancePostCard from '~/components/Cards/NewPerformancePostCard';
import Card from '~/components/Cards/Card';
import {
  CommentsOutlineIcon,
  BleedingHeartOutlineIcon,
  MessageOutlineIcon,
  MonitorOutlineIcon,
  SearchDatabaseOutlineIcon,
  SyncOutlineIcon,
} from '~/components/Icons/FlatIcons';

interface LoaderData {
  trendingSteamApps: TrendingSteamApp[];
  newPerformancePosts: PerformancePostBrief[];
}

export async function loader() {
  const NUM_TRENDING_APPS = 10;
  const NUM_RECENT_POSTS = 5;
  const trendingSteamApps = await findTrendingSteamApps(NUM_TRENDING_APPS);
  const newPerformancePosts = await findNewestPerformancePosts(NUM_RECENT_POSTS);
  return json<LoaderData>({
    trendingSteamApps,
    newPerformancePosts,
  });
}

export default function IndexRoute() {
  const { trendingSteamApps, newPerformancePosts } = useLoaderData<typeof loader>();
  return (
    <PageWrapper currentRoute="/">
      <div className="relative sm:flex sm:items-center sm:justify-center">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-20">
            <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
              <span className="block uppercase text-primary-highlight drop-shadow-md">
                Steamed Apples
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-center text-xl text-primary sm:max-w-3xl">
                Read and write user experience reports about steam games running on apple silicon from users verified to own the game.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-12 w-full">
        <div className="flex flex-col items-center gap-6 w-full">

          <h2 className="text-secondary text-2xl">New Features</h2>
          <div className="w-full max-w-3xl">
            <Card>
              <div>
                <ul className="flex flex-col gap-4">
                  <li className="flex items-center gap-4"><BleedingHeartOutlineIcon userLiked={false} size={36} className="inline -rotate-12 min-w-[40px] self-start md:self-center text-icon-secondary-highlight" />Added ability to like posts and see all the posts you liked in your profile</li>
                  <li className="flex items-center gap-4"><CommentsOutlineIcon size={32} className="inline rotate-12 min-w-[40px] self-start md:self-center text-icon-secondary-highlight" />Added section in profile to view all posts</li>
                  <li className="flex items-center gap-4"><MessageOutlineIcon size={32} className="inline -rotate-12 min-w-[40px] self-start md:self-center text-icon-secondary-highlight" />Added a "New Posts" section to highlight user posts</li>
                  <li className="flex items-center gap-4"><MonitorOutlineIcon size={32} className="inline rotate-12 min-w-[40px] self-start md:self-center text-icon-secondary-highlight" />Added ability to post average frame rate and stutter</li>
                  <li className="flex items-center gap-4"><SyncOutlineIcon size={32} className="inline -rotate-12 min-w-[40px] self-start md:self-center text-icon-secondary-highlight" />Added ability to re-sync Steam library from the user profile page</li>
                  <li className="flex items-center gap-4"><SearchDatabaseOutlineIcon size={32} className="inline rotate-12 min-w-[40px] self-start md:self-center text-icon-secondary-highlight" /> Added search filters for Apple compatibility, genres, and categories (e.g. Full Controller Support)</li>
                  {/* <li className="flex items-center gap-4"><GearOutlineIcon size={32} className="inline -rotate-12 min-w-[40px] self-start md:self-center text-icon-secondary-highlight" /> Changed post form so that attaching system specs to a post is now optional</li> */}
                </ul>
              </div>
            </Card>
          </div>
        </div>
        {(newPerformancePosts.length > 0) && (
          <div className="flex flex-col items-center gap-6 w-full">
            <h2 className="text-secondary text-2xl">New Posts</h2>
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
                    postId={id}
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
        {(trendingSteamApps.length > 0) && (
          <div className="flex flex-col items-center gap-6 w-full">
            <h2 className="text-secondary text-2xl">Trending Apps</h2>
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
      </div>
    </PageWrapper>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <PageWrapper currentRoute="/">
      <h1>Error in /index route</h1>
      <div>{error.message}</div>
    </PageWrapper>
  );
}
