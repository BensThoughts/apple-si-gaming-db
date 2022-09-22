import { Outlet } from '@remix-run/react';
import Main from '~/components/Layout/Main';
import PageHeader from '~/components/Layout/PageHeader';

export default function SearchRoute() {
  return (
    <div className="">
      <PageHeader title="Search" titlePosition="left" />
      <Main>
        <div className="flex flex-col w-full items-center gap-6">
          <div className="w-[180px] block">
            <img
              src="/svg-images/searching-robot.svg"
              alt="searching robot"
              onError={(e) => {
                e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
              }}
            />
          </div>
          <Outlet />
        </div>
      </Main>
    </div>
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


