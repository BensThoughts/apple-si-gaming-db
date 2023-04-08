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

  const MenuItem = ({
    to,
    label,
  }: { to: string, label: string}) => {
    return (
      <Link
        to={to}
        className="focus-visible:show-ring-tertiary focus-visible:bg-tertiary-highlight p-1 rounded-md font-medium
                   text-primary text-base w-full text-center hover:bg-tertiary-highlight group">
        {label}
      </Link>
    );
  };

  return (
    <PageWrapper title={title} topSpacer>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_minmax(357px,55rem)_1fr] grid-rows-[auto_1fr] gap-8 min-h-screen">
        <div className="col-start-1 col-span-full md:col-start-2 md:col-span-1 row-start-1 row-span-1">
          <div className="flex flex-col gap-2 items-center w-full min-w-[15rem] bg-tertiary rounded-lg p-4">
            <h2 className="text-lg text-secondary font-bold">Account Menu</h2>
            <MenuItem to="/profile" label="Profile" />
            <MenuItem to="/profile/library" label="Library" />
            <MenuItem to="/profile/systems" label="Systems" />
            <MenuItem to="/profile/posts" label="Posts" />
            <MenuItem to="/profile/liked-posts" label="Liked Posts" />
          </div>
        </div>
        <div className="block col-start-1 col-span-full md:col-start-3 md:col-span-1 row-start-2 md:row-start-1 row-span-1">
          <div className="flex justify-center w-full max-w-[55rem]">
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
