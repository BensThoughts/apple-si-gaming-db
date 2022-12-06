import { json, redirect } from '@remix-run/node';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useTransition } from '@remix-run/react';
import LibraryLayout from '~/components/Profile/Library/LibraryLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { useSteamUserOwnedApps } from '~/lib/hooks/useMatchesData';
import { doesSteamUserExist, updateUserOwnedApps, upsertSteamUser } from '~/models/steamUser.server';

export async function loader({ context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (!steamUser) {
    return redirect('/profile');
  }
  return json({});
}

export async function action({ request, context }: ActionArgs) {
  const { steamUser } = extractAppLoadContext(context);
  // TODO: This should maybe return more info about the problem
  if (!steamUser) {
    return redirect('/profile');
  }
  const formData = await request.formData();
  const action = formData.get('_profileAction');
  switch (action) {
    case 'updateOwnedGames': {
      const steamUserExists = await doesSteamUserExist(steamUser.steamUserId);
      if (!steamUserExists) {
        await upsertSteamUser(steamUser);
      }
      await updateUserOwnedApps(steamUser.steamUserId);
      return redirect('/profile/library');
    }
    default: {
      throw new Error('Unexpected action in /profile/library');
    }
  }
}

export default function ProfileAppsRoute() {
  const steamUserOwnedApps = useSteamUserOwnedApps();
  const ownedApps = steamUserOwnedApps ? steamUserOwnedApps : [];

  const transition = useTransition();

  const isSubmittingUpdateGames =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_profileAction') === 'updateOwnedGames';

  return (
    <LibraryLayout
      ownedApps={ownedApps}
      isSubmittingUpdateGames={isSubmittingUpdateGames}
    />
  );
}
