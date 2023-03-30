import type { MetaFunction } from '@remix-run/node';
import {
  Link,
  Outlet,
  useCatch,
  useLocation,
} from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';

import { metaTags } from '~/lib/meta-tags';
import LoginCard from '~/components/Profile/LoginCard';
import PrivacyCard from '~/components/Profile/PrivacyCard';
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
  const { pathname } = useLocation();
  const { userSession } = useUserSession();

  if (!userSession) {
    return (
      <PageWrapper topSpacer>
        <div className="flex flex-col items-center justify-center w-full">
          <div
            className="flex flex-col md:flex-row gap-4 md:gap-10 md:justify-evenly
               items-center p-4 md:p-6 rounded-lg border-1
               border-secondary-highlight bg-tertiary w-full max-w-4xl"
          >
            <LoginCard />
            <PrivacyCard />
          </div>
        </div>
      </PageWrapper>
    );
  }

  const lastSegment = pathname.substring(pathname.lastIndexOf('/') + 1);
  const titleWords = lastSegment.split('-');
  titleWords.forEach((letter, idx) => {
    const word = titleWords[idx];
    titleWords[idx] = word.charAt(0).toUpperCase() + word.slice(1);
  });
  const title = titleWords.join(' ');

  return (
    <PageWrapper title={title} topSpacer>
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-8 min-h-screen">
        <div className="col-start-1 col-span-1 row-start-1 row-span-1 min-w-[22rem]">
          <div className="flex flex-col gap-2 items-center w-full bg-tertiary rounded-lg p-4">
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
          </div>
        </div>
        <div className="block col-start-1 md:col-start-2 col-end-[-1] row-start-2 md:row-start-1 row-span-1">
          <div className="flex justify-center">
            <Outlet />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorDisplay includePageWrapper error={error} currentRoute="/profile" />;
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <CatchDisplay includePageWrap thrownResponse={caught} currentRoute="/profile" />
  );
}
