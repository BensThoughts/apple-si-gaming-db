import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useLoaderData,
} from '@remix-run/react';
import AsideInfoCard from '~/components/Cards/AsideInfoCard';
import LoginCard from '~/components/Cards/LoginCard';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { getSteamPlayerOwnedGamesRequest } from '~/lib/data-utils/steamApi.server';
import { updateUserOwnedApps } from '~/models/steamUser.server';

export async function loader({ request, context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (steamUser) {
    const userOwnedApps = await getSteamPlayerOwnedGamesRequest(steamUser.steamUserId);
    const ownedAppIds = userOwnedApps.games.map((app) => app.appid);
    const {
      steamUserId,
      displayName,
      avatarFull,
      ownedApps,
    } = await updateUserOwnedApps(ownedAppIds, steamUser.steamUserId);
    return json({
      isLoggedIn: true,
      steamUserId,
      displayName,
      avatarFull,
      ownedApps,
    });
  }
  return json({
    isLoggedIn: false,
    steamId: null,
    displayName: null,
    avatarFull: null,
    ownedApps: null,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: 'Login',
  };
};

export default function LoginPage() {
  const {
    isLoggedIn,
    displayName,
    avatarFull,
    ownedApps,
  } = useLoaderData<typeof loader>();
  return (
    <div className="flex gap-4 flex-col items-center bg-app-bg min-h-full">
      <h1 className="text-2xl h-12">Steam Account</h1>
      <div className="flex flex-col md:flex-row gap-8 justify-evenly">
        <LoginCard
          isLoggedIn={isLoggedIn}
          displayName={displayName}
          avatarFull={avatarFull}
        />
        <div className="max-w-md">
          <AsideInfoCard title="Note">
          Within your&nbsp;
            <a
              href="https://steamcommunity.com/my/edit/settings"
              rel="noopener noreferrer"
              target="_blank"
              className="underline"
            >Steam Privacy Settings</a>
          , &apos;My profile&apos; must be set to public. &apos;Game Details&apos;
          is not required to be public, but if it is, ownership and playtime information
          will be sent with your contributions.
          </AsideInfoCard>
        </div>
      </div>
      <div>
        {ownedApps && ownedApps.map((ownedApp) => (
          <div key={ownedApp.steamAppId}>
            {ownedApp.steamAppId} - {ownedApp.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Error in /profile route</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
