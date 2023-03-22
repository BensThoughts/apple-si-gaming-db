import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { useLikeButtonData } from '~/lib/hooks/useMatchesData';
import { BleedingHeartOutlineIcon } from './Icons/FlatIcons';
import { showToast } from './Toasts';

export default function LikeButton({
  performancePostId,
  numLikes,
}: {
  performancePostId: number;
  numLikes: number;
}) {
  const {
    isUserProfileLoggedIn,
    didUserProfileLikePerformancePost,
  } = useLikeButtonData(performancePostId);
  // without a userProfileId we can safely assume no logged in user, so no like
  const [likedPostRaw, setLikedPostRaw] = useState(didUserProfileLikePerformancePost);
  const [numLikesRaw, setNumLikesRaw] = useState(numLikes);

  const fetcher = useFetcher();

  const isSubmittingLike =
    fetcher.state === 'submitting' &&
    fetcher.submission.action === '/actions/like-post';
  // const isLoading = fetcher.state === 'loading';

  function onLikeClick() {
    if (isUserProfileLoggedIn) {
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
      showToast.login('You must login to like posts');
    }
  }

  return (
    <button
      onClick={onLikeClick}
      disabled={isSubmittingLike}
      type="submit"
      className="border-1 border-secondary-highlight rounded-full px-3 py-0.5
                  min-w-[75px] focus:outline-none focus-visible:show-ring"
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
