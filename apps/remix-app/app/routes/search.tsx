import type { MetaFunction } from '@remix-run/node';
import { Outlet, useCatch } from '@remix-run/react';
import CatchDisplay from '~/components/Layout/CatchDisplay';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import PageWrapper from '~/components/Layout/PageWrapper';
import { metaTags } from '~/lib/meta-tags';

export const meta: MetaFunction = () => ({
  'title': `${metaTags.title} - Search`,
});

export default function SearchRoute() {
  return (
    <PageWrapper currentRoute="/search" title="Search" topSpacer>
      <div className="flex flex-col w-full items-center gap-6">
        <Outlet />
      </div>
    </PageWrapper>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  // TODO: /apps is not technically the current route
  return <ErrorDisplay includePageWrapper error={error} currentRoute="/search" />;
}

export function CatchBoundary() {
  const caught = useCatch();
  // TODO: /apps is not technically the current route
  return (
    <CatchDisplay includePageWrap thrownResponse={caught} currentRoute="/search" />
  );
}

