import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Link,
  Outlet,
  useCatch,
  useLoaderData,
} from '@remix-run/react';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import PageWrapper from '~/components/Layout/PageWrapper';

import { metaTags } from '~/lib/meta-tags';
import LoginCard from '~/components/Profile/Login/LoginCard';
import PrivacyCard from '~/components/Profile/Login/PrivacyCard';

interface ProfileLoaderData {
  steamUserData: {
    contextData: {
      isLoggedIn: boolean;
      steamUserId?: string | null;
      displayName?: string | null;
      avatarFull?: string | null,
    }
  }
}

export async function loader({ context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (steamUser) {
    const {
      steamUserId,
      displayName,
      avatarFull,
    } = steamUser;
    return json<ProfileLoaderData>({
      steamUserData: {
        contextData: {
          isLoggedIn: true,
          steamUserId,
          displayName,
          avatarFull,
        },
      },
    });
  }
  return json<ProfileLoaderData>({
    steamUserData: {
      contextData: {
        isLoggedIn: false,
      },
    },
  });
}

export const meta: MetaFunction = ({ data }: { data: ProfileLoaderData }) => {
  if (data.steamUserData.contextData.displayName) {
    const { displayName } = data.steamUserData.contextData;
    return {
      title: displayName ? `${metaTags.title} - Profile - ${displayName}` : `Profile`,
    };
  }
  return {
    title: `${metaTags.title} - Login`,
  };
};

export default function ProfilePage() {
  const {
    steamUserData: {
      contextData: {
        isLoggedIn,
      },
    },
  } = useLoaderData<ProfileLoaderData>();

  if (!isLoggedIn) {
    return (
      <PageWrapper currentRoute="/profile" title="Profile" topSpacer>
        <div className="flex flex-col items-center w-full">
          <div
            className="flex flex-col md:flex-row gap-4 md:gap-6 md:justify-evenly
               items-center p-4 md:p-6 rounded-lg border-1
               border-secondary-highlight bg-tertiary w-full max-w-3xl"
          >
            <LoginCard />
            <PrivacyCard />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <>
      <PageWrapper currentRoute="/profile" title="Profile" topSpacer>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-screen">

          <div className="col-start-1 col-span-1 md:col-span-4 xl:col-span-3">
            <div className="flex flex-col items-center w-full max-w-xs bg-tertiary rounded-md p-4">
              <h2 className="text-lg text-secondary">Menu</h2>
              <Link to="/profile">
                Profile
              </Link>
              <Link to="/profile/library">
                Library
              </Link>
              <Link to="/profile/systems">
                Systems
              </Link>
              <Link to="/profile/achievements">
                Achievements
              </Link>
            </div>
          </div>
          <div className="md:col-start-5 xl:col-start-4 col-end-[-1]">
            <Outlet />
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <PageWrapper currentRoute="/profile" topSpacer>
      <h1>Error in /profile route</h1>
      <div>{error.message}</div>
    </PageWrapper>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <PageWrapper currentRoute="/profile" title="Oops!" topSpacer>
      <div>
        <h1>Oops! - {caught.status} - {caught.data}</h1>
      </div>
    </PageWrapper>
  );
}
