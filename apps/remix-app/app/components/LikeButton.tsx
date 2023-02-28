import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { BleedingHeartOutlineIcon } from './Icons/FlatIcons';
import { errorToast } from './Toasts';

export default function LikeButton({
  performancePostId,
  numLikes,
  isUserLoggedIn,
  hasLoggedInUserLiked,
}: {
  performancePostId: number;
  numLikes: number;
  isUserLoggedIn: boolean;
  hasLoggedInUserLiked: boolean;
}) {
  const [likedPostRaw, setLikedPostRaw] = useState(hasLoggedInUserLiked);
  const [numLikesRaw, setNumLikesRaw] = useState(numLikes);

  const fetcher = useFetcher();

  const isSubmittingLike =
    fetcher.state === 'submitting' &&
    fetcher.submission.action === '/actions/like-post';
  // const isLoading = fetcher.state === 'loading';

  function onLikeClick() {
    if (isUserLoggedIn) {
      if (!likedPostRaw) {
        setNumLikesRaw(numLikes + 1);
        setLikedPostRaw(true);
        fetcher.submit({
          performancePostId: performancePostId.toString(),
        }, { action: '/actions/like-post', method: 'post' });
      } else {
        setNumLikesRaw(numLikesRaw - 1);
        setLikedPostRaw(false);
        fetcher.submit({
          performancePostId: performancePostId.toString(),
        }, { action: '/actions/unlike-post', method: 'post' });
      }
    } else {
      errorToast('You must log in to like posts');
    }
  }

  return (
    <button
      onClick={onLikeClick}
      disabled={isSubmittingLike}
      type="submit"
      className={`border-1 border-secondary-highlight rounded-full px-3 py-0.5
                  min-w-[75px]`}
      aria-label={likedPostRaw ? 'unlike post' : 'like post'}
    >
      <div className="flex justify-between items-center gap-2">
        <BleedingHeartOutlineIcon
          size={30}
          className={`inline ${likedPostRaw ? 'text-primary' : 'text-primary-highlight'}`}
          userLiked={likedPostRaw}
        />
        <span className={`${isSubmittingLike ? 'text-primary' : 'text-primary-highlight'}`}>
          {numLikesRaw}
        </span>
      </div>
    </button>
  );
}
