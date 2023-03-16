import { json } from '@remix-run/node';
import type { MetaFunction } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';
import { findSteamAppsWherePostsExist, findTrendingSteamApps } from '~/models/Steam/steamApp.server';
import { findNewestPerformancePosts } from '~/models/SteamedApples/performancePost.server';
import type {
  TrendingSteamApp,
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
  steamAppsWherePostsExist: SteamAppForSmallDisplayCard[];
}

export async function loader() {
  const steamAppsWherePostsExist = await findSteamAppsWherePostsExist();
  return json<LoaderData>({
    steamAppsWherePostsExist,
  });
}

export const meta: MetaFunction = () => {
  return { title: `${metaTags.title} - Games` };
};

export default function SteamAppIdIndexRoute() {
  const {
    steamAppsWherePostsExist,
  } = useLoaderData<typeof loader>();
  return (
    <PageWrapper currentRoute="/apps" title="Games">
      <div className="flex flex-col items-center gap-12 w-full mt-6">
        <SmallAppsCard steamApps={steamAppsWherePostsExist} />
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
