import { json } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import { findNewestPerformancePosts } from '~/models/SteamedApples/performancePost.server';
import { findTrendingSteamApps } from '~/models/Steam/steamApp.server';
import PageWrapper from '~/components/Layout/PageWrapper';
import type {
  TrendingSteamApp,
  PerformancePostForNewPostsCard,
} from '~/types';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import CatchDisplay from '~/components/Layout/CatchDisplay';
import FeaturesSection from '~/components/Home/FeaturesSection';
import NewPerformancePostsSection from '~/components/Home/NewPerformancePostsSection';
import TrendingSteamAppsSection from '~/components/Home/TrendingSteamAppsSection';


interface LoaderData {
  trendingSteamApps: TrendingSteamApp[];
  newPerformancePosts: PerformancePostForNewPostsCard[];
}

export async function loader() {
  const NUM_TRENDING_APPS = 12;
  const NUM_RECENT_POSTS = 12;
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
    <PageWrapper>
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
      <div className="flex flex-col items-center gap-24 w-full">
        <FeaturesSection />
        <NewPerformancePostsSection newPerformancePosts={newPerformancePosts} />
        <TrendingSteamAppsSection trendingSteamApps={trendingSteamApps} />
      </div>
    </PageWrapper>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  // TODO: /apps is not technically the current route
  return <ErrorDisplay includePageWrapper error={error} currentRoute="/" />;
}

export function CatchBoundary() {
  const caught = useCatch();
  // TODO: /apps is not technically the current route
  return (
    <CatchDisplay includePageWrap thrownResponse={caught} currentRoute="/" />
  );
}
