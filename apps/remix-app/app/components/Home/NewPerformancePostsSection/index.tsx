import type { PerformancePostForNewPostsCard } from '~/types/remix-app';
import { Link } from '@remix-run/react';
import AvatarImage from '~/components/ImageWrappers/AvatarImage';
import { useState } from 'react';
import { classNames } from '~/lib/css/classNames';

export default function NewPerformancePostsSection({
  newPerformancePosts,
}: {
  newPerformancePosts: PerformancePostForNewPostsCard[]
}) {
  const [expanded, setExpanded] = useState(false);
  const MINIMUM_NUMBER_OF_POSTS = 6; // won't display right without at least
  if (newPerformancePosts.length < MINIMUM_NUMBER_OF_POSTS) {
    return null;
  }
  const numPostsPerCol = Math.ceil(newPerformancePosts.length / 3);
  const postsColOne = newPerformancePosts.slice(0, numPostsPerCol);
  const postsColTwo = newPerformancePosts.slice(numPostsPerCol, numPostsPerCol * 2);
  const postsColThree = newPerformancePosts.slice(numPostsPerCol * 2, newPerformancePosts.length);
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-3 md:px-5 flex flex-col gap-6 justify-center items-center">
      <h2 className="sr-only">New Posts</h2>
      <div
        className={classNames(
            'grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 p-1',
            !expanded ? 'max-h-[33rem] overflow-hidden' : '',
        )}
      >
        <ul className="space-y-8">
          {postsColOne.map((post) => (
            <li key={post.performancePostId} className="text-sm leading-6">
              <NewPerformancePostCard performancePost={post} />
            </li>
          ))}
          {postsColTwo.map((post) => (
            <li key={post.performancePostId} className="block sm:hidden">
              <NewPerformancePostCard performancePost={post} />
            </li>
          ))}
        </ul>
        <ul className="space-y-8 hidden sm:block">
          {postsColTwo.map((post) => (
            <li key={post.performancePostId} className="text-sm leading-6">
              <NewPerformancePostCard performancePost={post} />
            </li>
          ))}
        </ul>
        <ul className="space-y-8 hidden lg:block">
          {postsColThree.map((post) => (
            <li key={post.performancePostId} className="text-sm leading-6">
              <NewPerformancePostCard performancePost={post} />
            </li>
          ))}
        </ul>
      </div>
      <div
        className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-app-bg
                   to-transparent pt-32 pb-8 pointer-events-none absolute"
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="relative bg-secondary hover:bg-secondary-highlight focus:outline-none
                     focus-visible:show-ring text-sm text-primary-highlight font-semibold
                     h-12 px-6 rounded-lg flex items-center pointer-events-auto"
        >
          {expanded ? 'Show Less...' : 'Show More...'}
        </button>
      </div>
    </section>
  );
}

function NewPerformancePostCard({
  performancePost,
}: {
  performancePost: PerformancePostForNewPostsCard;
}) {
  const {
    performancePostId,
    postText,
    userWhoCreated,
    steamApp,
  } =performancePost;
  return (
    <Link to={`/apps/${steamApp.steamAppId}/posts#${performancePostId}`}
      className="relative flex flex-col-reverse bg-tertiary rounded-lg p-6
                 focus-visible:show-ring"
    >
      <figure>
        <blockquote className="mt-6 text-primary-highlight">
          <p className="line-clamp-3">
            {postText}
          </p>
        </blockquote>
      </figure>
      <figcaption className="flex items-center space-x-4">
        <div className="max-w-[64px] max-h-[64px]">
          <AvatarImage avatarFull={userWhoCreated.avatarFull} />
        </div>
        <div className="flex-auto">
          <div className="text-base text-primary-highlight font-semibold">
            {userWhoCreated.displayName ? userWhoCreated.displayName : 'anonymous'}
          </div>
          <div className="mt-0.5">
            {steamApp.name}
          </div>
        </div>
      </figcaption>
    </Link>
  );
}
