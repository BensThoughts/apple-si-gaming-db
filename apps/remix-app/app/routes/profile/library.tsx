import { json, redirect } from '@remix-run/node';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useLoaderData, useTransition } from '@remix-run/react';
import LibraryLayout from '~/components/Profile/Library/LibraryLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import {
  doesUserProfileExist,
  upsertUserProfileBySteamUserId64,
} from '~/models/SteamedApples/userProfile.server';
import {
  findSteamUserProfileOwnedSteamApps,
  updateSteamUserProfileOwnedSteamApps,
} from '~/models/Steam/steamUserProfile.server';
import { getProfileSession } from '~/lib/sessions/profile-session.server';

export async function loader({ context, request }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  const profileSession = await getProfileSession(request);
  if (!steamUser || !profileSession) {
    return redirect('/profile');
  }
  const { steamUserId64 } = steamUser;
  const ownedSteamApps = await findSteamUserProfileOwnedSteamApps(steamUserId64);
  return json({ ownedSteamApps });
}

export async function action({ request, context }: ActionArgs) {
  const profileSession = await getProfileSession(request);
  const profileId = profileSession.getUserProfileId();
  const { steamUser } = extractAppLoadContext(context);
  // TODO: This should maybe return more info about the problem
  if (!steamUser || !profileId) {
    return redirect('/profile');
  }
  const formData = await request.formData();
  const action = formData.get('_profileAction');
  switch (action) {
    case 'updateOwnedGames': {
      const userProfileExists = await doesUserProfileExist(profileId);
      if (!userProfileExists) {
        await upsertUserProfileBySteamUserId64(steamUser.steamUserId64, steamUser);
      }
      await updateSteamUserProfileOwnedSteamApps(steamUser.steamUserId64);
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
