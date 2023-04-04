import type { PerformancePostForUserProfileDisplay } from '~/interfaces';
import { useState } from 'react';
import UserProfilePostDisplayV2 from '../UserProfilePostDisplayV2';
import MaterialInputOutlined from '~/components/FormComponents/MaterialInputOutlined';

interface UserLikedPostsLayoutProps {
  likedPosts: PerformancePostForUserProfileDisplay[]
}

function getColumnOfPosts(
    posts: PerformancePostForUserProfileDisplay[],
    column: number,
    totalCols: number,
) {
  const postsInCol = [];
  for (let i = column - 1; i < posts.length; i = i + totalCols) {
    postsInCol.push(posts[i]);
  }
  return postsInCol;
}


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

  function searchNames(performancePosts: PerformancePostForUserProfileDisplay[]) {
    return performancePosts.filter(
        (post) =>
          (post.steamApp.name.toString().toLowerCase().includes(nameQuery.toLowerCase())))
        .sort((a, b) => (a.steamApp.name.toLowerCase() > b.steamApp.name.toLowerCase()) ? 1 : -1);
  }

  const filteredPosts = searchNames(likedPosts);
  const twoXLColumnOne = getColumnOfPosts(filteredPosts, 1, 4);
  const twoXLColumnTwo = getColumnOfPosts(filteredPosts, 2, 4);
  const twoXLColumnThree = getColumnOfPosts(filteredPosts, 3, 4);
  const twoXLColumnFour = getColumnOfPosts(filteredPosts, 4, 4);

  const xlColumnOne = getColumnOfPosts(filteredPosts, 1, 3);
  const xlColumnTwo = getColumnOfPosts(filteredPosts, 2, 3);
  const xlColumnThree = getColumnOfPosts(filteredPosts, 3, 3);

  const lgColumnOne = getColumnOfPosts(filteredPosts, 1, 2);
  const lgColumnTwo = getColumnOfPosts(filteredPosts, 2, 2);

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="bg-tertiary rounded-lg p-4 w-full max-w-2xl">
        <MaterialInputOutlined
          id="profileSearch"
          name="profileSearch"
          label="Game name..."
          componentSize="large"
          aria-label="Search games by name"
          onChange={(e) => setNameQuery(e.target.value)}
        />
      </div>
      <div className="w-full lg:hidden">
        <ul className="flex gap-y-6 flex-col items-center">
          {filteredPosts.map((post) => (
            <li key={post.performancePostId} className="lg:hidden">
              <UserProfilePostDisplayV2 performancePost={post} />
            </li>
          ))}
        </ul>
      </div>
      <div className="hidden w-full lg:flex xl:hidden justify-center">
        <ul className="flex gap-y-6 flex-col items-center">
          {lgColumnOne.map((post) => (
            <li key={post.performancePostId}>
              <UserProfilePostDisplayV2 performancePost={post} />
            </li>
          ))}
        </ul>
        {lgColumnTwo.length > 0 && (
          <ul className="flex gap-y-6 flex-col items-center ml-6">
            {lgColumnTwo.map((post) => (
              <li key={post.performancePostId}>
                <UserProfilePostDisplayV2 performancePost={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="hidden w-full xl:flex 2xl:hidden justify-center">
        <ul className="flex gap-y-6 flex-col items-center">
          {xlColumnOne.map((post) => (
            <li key={post.performancePostId}>
              <UserProfilePostDisplayV2 performancePost={post} />
            </li>
          ))}
        </ul>
        {xlColumnTwo.length > 0 && (
          <ul className="flex gap-y-6 flex-col items-center ml-6">
            {xlColumnTwo.map((post) => (
              <li key={post.performancePostId}>
                <UserProfilePostDisplayV2 performancePost={post} />
              </li>
            ))}
          </ul>
        )}
        {xlColumnThree.length > 0 && (
          <ul className="flex gap-y-6 flex-col items-center ml-6">
            {xlColumnThree.map((post) => (
              <li key={post.performancePostId}>
                <UserProfilePostDisplayV2 performancePost={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="hidden w-full 2xl:flex justify-center">
        <ul className="flex gap-y-6 flex-col items-center">
          {twoXLColumnOne.map((post) => (
            <li key={post.performancePostId}>
              <UserProfilePostDisplayV2 performancePost={post} />
            </li>
          ))}
        </ul>
        {twoXLColumnTwo.length > 0 && (
          <ul className="flex gap-y-6 flex-col items-center ml-6">
            {twoXLColumnTwo.map((post) => (
              <li key={post.performancePostId}>
                <UserProfilePostDisplayV2 performancePost={post} />
              </li>
            ))}
          </ul>
        )}
        {twoXLColumnThree.length > 0 && (
          <ul className="flex gap-y-6 flex-col items-center ml-6">
            {twoXLColumnThree.map((post) => (
              <li key={post.performancePostId}>
                <UserProfilePostDisplayV2 performancePost={post} />
              </li>
            ))}
          </ul>
        )}
        {twoXLColumnFour.length > 0 && (
          <ul className="flex gap-y-6 flex-col items-center ml-6">
            {twoXLColumnFour.map((post) => (
              <li key={post.performancePostId}>
                <UserProfilePostDisplayV2 performancePost={post} />
              </li>
            ))}
          </ul>
        )}
      </div>


      {/* <div className="">
        {likedPosts.map((performancePost) => (
          <Fragment key={performancePost.performancePostId}>
            <UserProfilePostDisplayV2
              performancePost={performancePost}
            />
          </Fragment>
        ))}
      </div> */}
    </div>
  );
}
