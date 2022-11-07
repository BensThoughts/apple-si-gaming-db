import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';
import { metaTags } from '~/lib/meta-tags';

export const meta: MetaFunction = () => ({
  'title': `${metaTags.title} - Search`,
});

export default function SearchRoute() {
  return (
    <PageWrapper title="Search" topSpacer>
      <div className="flex flex-col w-full items-center gap-6">
        <Outlet />
      </div>
    </PageWrapper>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Error in /search route</h1>
      <div>{error.message}</div>
    </div>
  );
}


