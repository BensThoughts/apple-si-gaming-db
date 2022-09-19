import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';

export async function loader({ params }: LoaderArgs) {
  invariant(params.steamAppId, 'Expected params.steamAppId');
  const steamAppId = Number(params.steamAppId);
  invariant(isFinite(steamAppId), 'Expected steamAppId to be a valid number');
  return redirect(`/apps/${steamAppId}/performance-posts`);
}
