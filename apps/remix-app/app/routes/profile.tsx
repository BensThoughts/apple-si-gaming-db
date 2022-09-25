import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useLoaderData,
} from '@remix-run/react';
import AsideCard from '~/components/Cards/AsideCard';
import LoginCard from '~/components/Profile/LoginCard';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findUserProfileData } from '~/models/steamUser.server';
import ExternalLink from '~/components/ExternalLink';
import PageWrapper from '~/components/Layout/PageWrapper';
import UserDisplay from '~/components/Profile/UserDisplay';

export async function loader({ request, context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (steamUser) {
    const userProfile = await findUserProfileData(steamUser.steamUserId);
    if (userProfile) {
      const {
        steamUserId,
        displayName,
        avatarFull,
        ownedApps,
        systemSpecs,
      } = userProfile;
      return json({
        isLoggedIn: true,
        steamUserId,
        displayName,
        avatarFull,
        ownedApps,
        systemNames: systemSpecs.map((systemSpec) => systemSpec.systemName),
      });
    } else {
      return json({
        isLoggedIn: true,
        steamUserId: null,
        displayName: null,
        avatarFull: null,
        ownedApps: null,
        systemNames: null,
      });
    }
  }
  return json({
    isLoggedIn: false,
    steamId: null,
    displayName: null,
    avatarFull: null,
    ownedApps: null,
    systemNames: null,
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
    systemNames,
  } = useLoaderData<typeof loader>();
  return (
    <PageWrapper title="Profile">
      <div className="flex flex-col gap-6 items-center w-full">
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
        {isLoggedIn ? (
          <div>
            <UserDisplay
              ownedApps={ownedApps}
              systemNames={systemNames}
            />
          </div>
        ) : (
          null
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
