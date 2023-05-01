import TierRankContainer from './CardComponents/TierRankContainer';
import type {
  PerformancePost,
} from '~/types';
import PerformancePostUserBadge from './CardComponents/UserBadge';
import LikeButton from '~/components/Buttons/LikeButton';
import SystemSpecsPopover from '~/components/HeadlessComponents/SystemSpecPopover';
import EditButton from '~/components/Buttons/EditButton';
import HTMLContainer from './CardComponents/HTMLContainer';

export default function PerformancePostCard({
  performancePost,
}: {
  performancePost: PerformancePost;
}) {
  const {
    performancePostId,
    createdAt,
    postText,
    userWhoCreated: {
      steamUserId64,
      avatarMedium,
      displayName,
    },
    rating: {
      ratingTierRank,
      frameRateTierRank,
      frameRateStutters,
      gamepadTierRank,
      gamepadMetadata,
    },
    numLikes,
    systemSpec,
    postTags,
    steamApp: { steamAppId },
  } = performancePost;

  return (
    <div
      id={performancePostId.toString()}
      className="flex flex-col gap-4 w-full h-full bg-tertiary px-3 lg:px-4 py-4 rounded-lg"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-0 lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <LikeButton performancePostId={performancePostId} numLikes={numLikes} />
          <SystemSpecsPopover systemSpec={systemSpec} giveButtonStyles />
          <EditButton
            steamAppId={steamAppId}
            performancePostId={performancePostId}
            userWhoCreated={{ steamUserId64 }}
          />
        </div>
        <div className="flex pr-2 min-w-[165px]">
          <PerformancePostUserBadge
            avatarMedium={avatarMedium}
            displayName={displayName}
            createdAt={createdAt}
          />
        </div>
      </div>
      <HTMLContainer htmlString={postText} />
      <TierRankContainer
        rating={{
          ratingTierRank,
          frameRateTierRank,
          frameRateStutters,
          gamepadMetadata,
          gamepadTierRank,
        }}
        postTags={postTags}
      />
    </div>
  );
}
