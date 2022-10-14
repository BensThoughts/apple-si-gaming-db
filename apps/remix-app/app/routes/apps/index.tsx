import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useCatch } from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';

export async function loader({ params }: LoaderArgs) {
  if (!params.steamAppId) {
    throw new Response('Expected params.steamAppid');
  }
  const steamAppId = Number(params.steamAppId);
  if (!isFinite(steamAppId) || steamAppId < 0) {
    throw new Response('steam appid must be a valid positive number');
  }
  return redirect(`/apps/${steamAppId}/performance-posts`);
}

export default function SteamAppIdIndexRoute() {
  return null;
}

export function CatchBoundary() {
  const caught = useCatch();
  console.log(caught);
  return (
    <PageWrapper title="Oops!">
      <div>
        <h1>Oops! - {caught.status} - {caught.data}</h1>
        {caught.status === 404 && (
          <img
            src="/svg-images/four-oh-four-error.svg"
            alt="Four oh four error"
          />
        )}
      </div>
    </PageWrapper>
  );
}
