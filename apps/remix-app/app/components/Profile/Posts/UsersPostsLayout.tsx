import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type {
  PerformancePostForUserProfileDisplay,
} from '~/interfaces';
import { Fragment } from 'react';
import UserProfilePostDisplay from '../UserProfilePostDisplay';

interface UsersPostsLayoutProps {
  steamUsersPosts: PerformancePostForUserProfileDisplay[];
}

export default function UsersPostsLayout({
  steamUsersPosts,
}: UsersPostsLayoutProps) {
  if (steamUsersPosts.length < 1) {
    return (
      <div className="max-w-max p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
        <span>
            You haven't posted yet.  Post a report for a game in your{` `}
          <RemixUnderlineLink
            to="/profile/library"
          >
              library
          </RemixUnderlineLink>
          {` `}to see it appear here.
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {steamUsersPosts.map((performancePost) => (
        <Fragment key={performancePost.performancePostId}>
          <UserProfilePostDisplay
            performancePost={performancePost}
          />
        </Fragment>
      ))}
    </div>
  );
}
