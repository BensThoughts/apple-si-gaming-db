import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useCatch } from '@remix-run/react';
import CatchDisplay from '~/components/Layout/CatchDisplay';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import { validateSteamAppId } from '~/lib/loader-functions/params-validators.server';

export async function loader({ params }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  return redirect(`/apps/${steamAppId}/posts`);
}

export default function SteamAppIdIndexRoute() {
  return null;
}

export function ErrorBoundary({ error }: { error: Error }) {
  // TODO: /apps is not technically the current route
  return <ErrorDisplay includePageWrapper={false} error={error} currentRoute="/apps" />;
}

export function CatchBoundary() {
  const caught = useCatch();
  // TODO: /apps is not technically the current route
  return (
    <CatchDisplay includePageWrap={false} thrownResponse={caught} currentRoute="/apps" />
  );
}
