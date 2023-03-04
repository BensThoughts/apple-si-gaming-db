import { json } from '@remix-run/node';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useLoaderData, useTransition } from '@remix-run/react';
import LibraryLayout from '~/components/Profile/Library/LibraryLayout';
import {
  findSteamUserProfileOwnedSteamApps,
  updateSteamUserProfileOwnedSteamApps,
} from '~/models/Steam/steamUserProfile.server';
import { requireUserIds } from '~/lib/sessions/profile-session.server';

export async function loader({ request }: LoaderArgs) {
  const { steamUserId64 } = await requireUserIds(request, '/profile');
  const ownedSteamApps = await findSteamUserProfileOwnedSteamApps(steamUserId64);
  return json({ ownedSteamApps });
}

export async function action({ request, context }: ActionArgs) {
  const { steamUserId64 } = await requireUserIds(request, '/profile');
  const formData = await request.formData();
  const action = formData.get('_profileAction');
  switch (action) {
    case 'updateOwnedGames': {
      // const userProfileExists = await doesUserProfileExist(userProfileId);
      // if (!userProfileExists) {
      //   await upsertUserProfileBySteamUserId64(steamUserId64, steamUser);
      // }
      await updateSteamUserProfileOwnedSteamApps(steamUserId64);
      return json({});
    }
    default: {
      throw new Error('Unexpected action in /profile/library');
    }
  }
}

export default function ProfileAppsRoute() {
  const { ownedSteamApps } = useLoaderData<typeof loader>();
  const transition = useTransition();

  const isSubmittingUpdateGames =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_profileAction') === 'updateOwnedGames';

  return (
    <LibraryLayout
      ownedApps={ownedSteamApps}
      isSubmittingUpdateGames={isSubmittingUpdateGames}
    />
  );
}
