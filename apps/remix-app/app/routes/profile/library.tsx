import { json, redirect } from '@remix-run/node';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useTransition } from '@remix-run/react';
import LibraryLayout from '~/components/Profile/Library/LibraryLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { useSteamUserOwnedSteamApps } from '~/lib/hooks/useMatchesData';
import {
  doesUserProfileExist,
  upsertUserProfileBySteamUserId64,
} from '~/models/SteamedApples/userProfile.server';
import {
  updateSteamUserProfileOwnedSteamApps,
} from '~/models/Steam/steamUserProfile.server';
import { getProfileSession } from '~/lib/sessions/profile-session.server';

export async function loader({ context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (!steamUser) {
    return redirect('/profile');
  }
  return json({});
}

export async function action({ request, context }: ActionArgs) {
  const profileSession = await getProfileSession(request);
  const profileId = Number(profileSession.getUserProfileId());
  const { steamUser } = extractAppLoadContext(context);
  // TODO: This should maybe return more info about the problem
  if (!steamUser || !isFinite(profileId)) {
    return redirect('/profile');
  }
  const formData = await request.formData();
  const action = formData.get('_profileAction');
  switch (action) {
    case 'updateOwnedGames': {
      const steamUserExists = await doesUserProfileExist(profileId);
      if (!steamUserExists) {
        await upsertUserProfileBySteamUserId64(steamUser.steamUserId64, steamUser);
      }
      await updateSteamUserProfileOwnedSteamApps(steamUser.steamUserId64);
      return redirect('/profile/library');
    }
    default: {
      throw new Error('Unexpected action in /profile/library');
    }
  }
}

export default function ProfileAppsRoute() {
  const userOwnedApps = useSteamUserOwnedSteamApps();

  const transition = useTransition();

  const isSubmittingUpdateGames =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_profileAction') === 'updateOwnedGames';

  return (
    <LibraryLayout
      ownedApps={userOwnedApps}
      isSubmittingUpdateGames={isSubmittingUpdateGames}
    />
  );
}
