import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useLoaderData,
} from '@remix-run/react';
import AsideCard from '~/components/Cards/AsideCard';
import LoginCard from '~/components/Profile/LoginCard';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findUserOwnedApps } from '~/models/steamUser.server';
import ExternalLink from '~/components/ExternalLink';
import OwnedApps from '~/components/Profile/OwnedApps';
import Heading from '~/components/Heading';
import PageWrapper from '~/components/Layout/PageWrapper';

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
    <PageWrapper title="Profile">
      <div className="flex flex-col gap-4 items-center w-full">
        <div className="flex flex-col md:flex-row gap-8 justify-evenly">
          <LoginCard
            isLoggedIn={isLoggedIn}
            displayName={displayName}
            avatarFull={avatarFull}
          />
          <div className="max-w-md">
            <AsideCard title="Note" iconBackground="secondary">
            Within your&nbsp;
              <ExternalLink
                href="https://steamcommunity.com/my/edit/settings"
                className="underline-offset-2"
              >
              Steam Privacy Settings
              </ExternalLink>
            , &apos;My profile&apos; must be set to public. &apos;Game Details&apos;
            is also required to be public, so that ownership can be verified for your contributions.
            </AsideCard>
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
    </PageWrapper>
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
