import type { MetaFunction } from '@remix-run/node';
import {
  Link,
  Outlet,
  useCatch,
} from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';

import { metaTags } from '~/lib/meta-tags';
import LoginCard from '~/components/Profile/Login/LoginCard';
import PrivacyCard from '~/components/Profile/Login/PrivacyCard';
import AnimatedUnderline from '~/components/AnimatedUnderline';
import { useUserSession } from '~/lib/hooks/useMatchesData';
import type { SerializedRootLoaderData } from '~/root';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import CatchDisplay from '~/components/Layout/CatchDisplay';

export const meta: MetaFunction = ({ parentsData }) => {
  const data = parentsData['root'] as Partial<SerializedRootLoaderData>;
  if (data?.userSession?.steamUserProfile.displayName) {
    const { displayName } = data.userSession.steamUserProfile;
    return {
      title: displayName ? `${metaTags.title} - Profile - ${displayName}` : `Profile`,
    };
  }
  return {
    title: `${metaTags.title} - Profile`,
  };
};

export default function ProfilePage() {
  const { userSession } = useUserSession();

  if (!userSession) {
    return (
      <PageWrapper currentRoute="/profile" title="Login" topSpacer>
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

          <div className="col-start-1 col-span-1 justify-items-center md:col-span-4 xl:col-span-3">
            <div className="flex flex-col gap-2 items-center w-full md:max-w-xs bg-tertiary rounded-md p-4">
              <h2 className="text-lg text-secondary">Menu</h2>
              <Link to="/profile" className="focus-visible:show-ring px-1 rounded-sm font-medium text-primary">
                <AnimatedUnderline>
                  Profile
                </AnimatedUnderline>
              </Link>
              <Link to="/profile/library" className="focus-visible:show-ring px-1 rounded-sm font-medium text-primary">
                <AnimatedUnderline>
                  Library
                </AnimatedUnderline>
              </Link>
              <Link to="/profile/systems" className="focus-visible:show-ring px-1 rounded-sm font-medium text-primary">
                <AnimatedUnderline>
                  Systems
                </AnimatedUnderline>
              </Link>
              <Link to="/profile/posts" className="focus-visible:show-ring px-1 rounded-sm font-medium text-primary">
                <AnimatedUnderline>
                  Posts
                </AnimatedUnderline>
              </Link>
              <Link to="/profile/liked-posts" className="focus-visible:show-ring px-1 rounded-sm font-medium text-primary">
                <AnimatedUnderline>
                  Liked Posts
                </AnimatedUnderline>
              </Link>
              {/* <Link to="/profile/achievements" className="focus-visible:show-ring px-1 rounded-sm font-medium text-primary">
                <AnimatedUnderline>
                  Achievements
                </AnimatedUnderline>
              </Link> */}
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
  return <ErrorDisplay error={error} currentRoute="/profile" />;
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <CatchDisplay thrownResponse={caught} currentRoute="/profile" />
  );
}
