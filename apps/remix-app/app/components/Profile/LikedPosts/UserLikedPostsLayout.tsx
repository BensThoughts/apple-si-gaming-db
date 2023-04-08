import type { PerformancePost } from '~/interfaces';
import { useState } from 'react';
import UserProfilePostDisplayV2 from '../UserProfilePostDisplayV2';
import MaterialInputOutlined from '~/components/FormComponents/MaterialInputOutlined';

interface UserLikedPostsLayoutProps {
  likedPosts: PerformancePost[];
}

// function getColumnOfPosts(
//     posts: PerformancePost[],
//     column: number,
//     totalCols: number,
// ) {
//   const postsInCol = [];
//   for (let i = column - 1; i < posts.length; i = i + totalCols) {
//     postsInCol.push(posts[i]);
//   }
//   return postsInCol;
// }


export default function UserLikedPostsLayout({
  likedPosts,
}: UserLikedPostsLayoutProps) {
  const [nameQuery, setNameQuery] = useState('');

  if (likedPosts.length < 1) {
    return (
      <div className="max-w-max p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
          You haven't liked any posts yet. Like posts to see them appear here.
      </div>
    );
  }

  function searchNames(performancePosts: PerformancePost[]) {
    return performancePosts.filter(
        (post) =>
          (post.steamApp.name.toString().toLowerCase().includes(nameQuery.toLowerCase())))
        .sort((a, b) => (a.steamApp.name.toLowerCase() > b.steamApp.name.toLowerCase()) ? 1 : -1);
  }

  const filteredPosts = searchNames(likedPosts);

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
      <ul className="w-full user-profile-liked-posts-grid">
        {filteredPosts.map((post) => (
          <li key={post.performancePostId} className="flex justify-center items-stretch">
            <UserProfilePostDisplayV2 performancePost={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
