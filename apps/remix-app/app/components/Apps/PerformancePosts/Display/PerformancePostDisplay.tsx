import TierRankContainer from './TierRankContainer';
import SystemSpecsPopover from '~/components/HeadlessComponents/SystemSpecPopover';
import type {
  PerformancePost,
} from '~/interfaces';
import { useUserSession } from '~/lib/hooks/useMatchesData';
import EditButton from '~/components/Buttons/EditButton';
import PerformancePostBadge from './Badge';
import LikeButton from '~/components/Buttons/LikeButton';

type PerformancePostDisplayProps = {
  performancePost: PerformancePost;
}

export default function PerformancePostDisplay({
  performancePost,
}: PerformancePostDisplayProps) {
  const {
    performancePostId,
    createdAt,
    postText,
    userWhoCreated,
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
    steamApp: {
      steamAppId,
    },
  } = performancePost;

  const { userSession } = useUserSession();

  const didSteamUserCreatePost = userSession
    ? userWhoCreated.steamUserId64 === userSession.steamUserProfile.steamUserId64
    : false;

  const {
    avatarMedium,
    displayName,
  } = userWhoCreated;

  return (
    <div className="flex flex-col gap-4 w-full h-full bg-tertiary px-3 lg:px-4 py-4 rounded-lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-0 lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <LikeButton performancePostId={performancePostId} numLikes={numLikes} />
          <SystemSpecsPopover systemSpec={systemSpec} giveButtonStyles />
          {didSteamUserCreatePost && (
            <div>
              <EditButton
                steamAppId={steamAppId}
                performancePostId={performancePostId}
              />
            </div>
          )}
        </div>
        <div className="flex pr-2 min-w-[165px]">
          <PerformancePostBadge
            avatarMedium={avatarMedium}
            displayName={displayName}
            createdAt={createdAt}
          />
        </div>
      </div>

      <div className="text-primary-highlight">
        {postText}
      </div>

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
