import type { PerformancePostForUserProfileDisplay } from '~/interfaces';
import UserProfilePostDisplay from '../UserProfilePostDisplay';
import { Fragment } from 'react';

interface UserLikedPostsLayoutProps {
  likedPosts: PerformancePostForUserProfileDisplay[]
}

export default function UserLikedPostsLayout({
  likedPosts,
}: UserLikedPostsLayoutProps) {
  if (likedPosts.length < 1) {
    return (
      <div className="max-w-max p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
          You haven't liked any posts yet. Like posts to see them appear here.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {likedPosts.map((performancePost) => (
        <Fragment key={performancePost.performancePostId}>
          <UserProfilePostDisplay
            performancePost={performancePost}
          />
        </Fragment>
      ))}
    </div>
  );
}
