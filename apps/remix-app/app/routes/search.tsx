import { Outlet } from '@remix-run/react';
import SearchInput from '~/components/SearchInput';


export default function SearchRoute() {
  return (
    <div className="flex flex-col gap-6 items-center min-h-screen bg-app-bg w-full">
      <div className="mt-2">
        <SearchInput size="large" />
      </div>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Error in /search route</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
