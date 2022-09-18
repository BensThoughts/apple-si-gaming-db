import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useLoaderData,
} from '@remix-run/react';
import AsideInfoCard from '~/components/Cards/AsideInfoCard';
import LoginCard from '~/components/Profile/LoginCard';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findUserOwnedApps } from '~/models/steamUser.server';
import ExternalLink from '~/components/ExternalLink';
import OwnedApps from '~/components/Profile/OwnedApps';
import Heading from '~/components/Heading';

export async function loader({ request, context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (steamUser) {
    const userOwnedApps = await findUserOwnedApps(steamUser.steamUserId);
    if (userOwnedApps) {
      const {
        steamUserId,
        displayName,
        avatarFull,
        ownedApps,
      } = userOwnedApps;
      return json({
        isLoggedIn: true,
        steamUserId,
        displayName,
        avatarFull,
        ownedApps,
      });
    } else {
      return json({
        isLoggedIn: true,
        steamUserId: null,
        displayName: null,
        avatarFull: null,
        ownedApps: null,
      });
    }
  }
  return json({
    isLoggedIn: false,
    steamId: null,
    displayName: null,
    avatarFull: null,
    ownedApps: null,
  });
}

export const meta: MetaFunction = ({ data }) => {
  if (data.isLoggedIn) {
    return {
      title: data.displayName ? `Profile - ${data.displayName}` : `Profile`,
    };
  }
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
    <div className="flex gap-4 flex-col items-center min-h-full">
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
            <ExternalLink
              href="https://steamcommunity.com/my/edit/settings"
              className='underline-offset-2'
            >
              Steam Privacy Settings
            </ExternalLink>
            , &apos;My profile&apos; must be set to public. &apos;Game Details&apos;
            is also required to be public, so that ownership can be verified for your contributions.
          </AsideInfoCard>
        </div>
      </div>
      <Heading>Library</Heading>
      {(ownedApps && ownedApps.length > 0) ? (
        <div>
          <OwnedApps ownedApps={ownedApps} />
        </div>
      ) : (
        <div>
          {isLoggedIn ? (
            <div>
              You are logged in but appear to have no apps owned. Is your Steam profile
              set to public?
            </div>
          ): (
            <div>
              You must log in to see the apps you own
            </div>
          )}
        </div>
      )}
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
