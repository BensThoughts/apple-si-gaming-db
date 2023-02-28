import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useCatch } from '@remix-run/react';
import { validateSteamAppId } from '~/lib/loader-functions/params-validators.server';

export async function loader({ params }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  return redirect(`/apps/${steamAppId}/posts`);
}

export default function SteamAppIdIndexRoute() {
  return null;
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>Oops! - {caught.status} - {caught.data}</h1>
      <p>Error in /apps/$steamAppId/index route</p>
    </div>
  );
}
