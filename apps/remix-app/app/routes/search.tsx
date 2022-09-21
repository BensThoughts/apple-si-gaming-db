import { Outlet } from '@remix-run/react';

export default function SearchRoute() {
  return (
    <div className="flex flex-col gap-6 items-center min-h-screen w-full">
      <div className="w-full min-h-[2rem] bg-primary py-2 px-6">
        <h1 className="text-2xl md:text-3xl text-center text-secondary">
          Search
        </h1>
      </div>
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


