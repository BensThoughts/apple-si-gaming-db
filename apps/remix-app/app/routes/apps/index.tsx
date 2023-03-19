import { json } from '@remix-run/node';
import type { MetaFunction } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';
import { findSteamAppsWherePostsExist } from '~/models/Steam/steamApp.server';
import { metaTags } from '~/lib/meta-tags';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import CatchDisplay from '~/components/Layout/CatchDisplay';
import SmallAppsGridLayout from '~/components/Apps/SmallAppsGridLayout';


export async function loader() {
  const steamAppsWherePostsExist = await findSteamAppsWherePostsExist();
  return json({
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
    <PageWrapper title="Games With Posts">
      <div className="flex flex-col items-center gap-12 w-full mt-6">
        <SmallAppsGridLayout steamApps={steamAppsWherePostsExist} />
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
