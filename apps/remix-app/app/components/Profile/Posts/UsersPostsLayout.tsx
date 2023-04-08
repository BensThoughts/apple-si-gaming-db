import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type {
  PerformancePost,
} from '~/types';
import { Fragment, useState } from 'react';
// import UserProfilePostDisplayV2 from '../UserProfilePostDisplayV2';
import UserProfilePostDisplay from '../UserProfilePostDisplay';
import MaterialInputOutlined from '~/components/FormComponents/MaterialInputOutlined';

interface UsersPostsLayoutProps {
  steamUsersPosts: PerformancePost[];
}

export default function UsersPostsLayout({
  steamUsersPosts,
}: UsersPostsLayoutProps) {
  const [nameQuery, setNameQuery] = useState('');

  function searchNames(performancePosts: PerformancePost[]) {
    return performancePosts.filter(
        (post) =>
          (post.steamApp.name.toString().toLowerCase().includes(nameQuery.toLowerCase())))
        .sort((a, b) => ((new Date(a.createdAt)) > new Date(b.createdAt)) ? 1 : -1);
  }

  const filteredPosts = searchNames(steamUsersPosts);

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
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="bg-tertiary rounded-lg p-4 w-full">
        <MaterialInputOutlined
          id="profileSearch"
          name="profileSearch"
          label="Game name..."
          componentSize="large"
          aria-label="Search games by name"
          onChange={(e) => setNameQuery(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-6 items-center w-full">
        {filteredPosts.map((performancePost) => (
          <Fragment key={performancePost.performancePostId}>
            <UserProfilePostDisplay
              performancePost={performancePost}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
