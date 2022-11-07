import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useCatch } from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';
import { validateSteamAppId } from '~/lib/loader-functions/params-validators.server';

export async function loader({ params }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  return redirect(`/apps/${steamAppId}/performance-posts`);
}

export default function SteamAppIdIndexRoute() {
  return null;
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <PageWrapper currentRoute="/apps" title="Oops!" topSpacer>
      <div>
        <h1>Oops! - {caught.status} - {caught.data}</h1>
        <p>Error in /apps/index route</p>
      </div>
    </PageWrapper>
  );
}
