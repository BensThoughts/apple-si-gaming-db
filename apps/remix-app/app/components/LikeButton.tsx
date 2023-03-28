import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { useLikeButtonData } from '~/lib/hooks/useMatchesData';
import { BleedingHeartSimpleSolidIcon } from '~/components/Icons/FlatIcons/Solid';
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
  const [likedPostRaw, setLikedPostRaw] = useState(didUserProfileLikePerformancePost);
  const [numLikesRaw, setNumLikesRaw] = useState(numLikes);

  const fetcher = useFetcher();

  const isSubmittingLike =
    fetcher.state === 'submitting' &&
    fetcher.submission.action === '/actions/like-post';

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
      className="border-1 border-secondary-highlight rounded-full px-3 py-1.5
                  min-w-[75px] focus-visible:show-ring"
      aria-label={likedPostRaw ? 'unlike post' : 'like post'}
    >
      <div className="flex justify-between items-center gap-1">
        <BleedingHeartSimpleSolidIcon
          size={30}
          className={likedPostRaw
              ? 'fill-heart stroke-text-primary h-6 w-6'
              : 'fill-transparent stroke-text-primary-highlight h-6 w-6'}
        />
        <span className={`${isSubmittingLike ? 'text-primary' : 'text-primary-highlight'}`}>
          {numLikesRaw}
        </span>
      </div>
    </button>
  );
}
