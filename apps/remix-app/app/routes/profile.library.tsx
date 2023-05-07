import { json } from '@remix-run/node';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import LibraryLayout from '~/components/Profile/Library/LibraryLayout';
import {
  findSteamUserProfileOwnedSteamApps,
  updateSteamUserProfileOwnedSteamApps,
} from '~/models/Steam/steamUserProfile.server';
import { requireUserIds } from '~/lib/sessions/profile-session.server';
import type { SteamAppForSmallAppsGridLayout } from '~/types/remix-app';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import CatchDisplay from '~/components/Layout/CatchDisplay';

type LibraryLoaderData = {
  ownedSteamApps: SteamAppForSmallAppsGridLayout[];
}

export async function loader({ request }: LoaderArgs) {
  const { steamUserId64 } = await requireUserIds(request, '/profile');
  const ownedSteamApps = await findSteamUserProfileOwnedSteamApps(steamUserId64);
  return json<LibraryLoaderData>({ ownedSteamApps });
}

export type LibraryActionData = {
  updateOwnedGames: {
    success: boolean;
  }
}

export async function action({ request, context }: ActionArgs) {
  const { steamUserId64 } = await requireUserIds(request, '/profile');
  const formData = await request.formData();
  const action = formData.get('_profileAction');
  if (typeof action != 'string') {
    throw new Error('invalid form submission, typeof action does not equal string');
  }
  switch (action) {
    case 'updateOwnedGames': {
      const { success } = await updateSteamUserProfileOwnedSteamApps(steamUserId64);
      return json<LibraryActionData>({ updateOwnedGames: { success } });
    }
    default: {
      throw new Error(`unexpected action ${action} in /profile/library`);
    }
  }
}

export default function ProfileAppsRoute() {
  const { ownedSteamApps } = useLoaderData<typeof loader>();
  return <LibraryLayout ownedApps={ownedSteamApps} />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorDisplay includePageWrapper={false} error={error} currentRoute="/profile/library" />;
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <CatchDisplay includePageWrap={false} thrownResponse={caught} currentRoute="/profile/library" />
  );
}
