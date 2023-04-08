import type { PerformancePost } from '~/types';
import PerformancePostTierRankContainer from '../Apps/PerformancePosts/Display/TierRankContainer';
import EditButton from '../Buttons/EditButton';
import SystemSpecsPopover from '../HeadlessComponents/SystemSpecPopover';
import LikeButton from '../Buttons/LikeButton';
import PerformancePostAppBadge from '../Apps/PerformancePosts/Display/AppBadge';
import ViewButton from '../Buttons/ViewButton';

export default function UserProfilePostDisplay({
  performancePost,
}: {
  performancePost: PerformancePost;
}) {
  const {
    performancePostId,
    createdAt,
    userWhoCreated: { steamUserId64 },
    numLikes,
    postText,
    steamApp: {
      steamAppId,
      name,
      headerImage,
    },
    rating,
    postTags,
    systemSpec,
  } = performancePost;
  return (
    <div
      id={performancePostId.toString()}
      className="px-3 py-4 md:px-4 rounded-lg bg-tertiary w-full flex flex-col gap-4 items-start justify-center"
    >
      <div className="w-full flex flex-col gap-4 justify-center lg:flex-row lg:gap-0 lg:items-center lg:justify-between">
        <PerformancePostAppBadge headerImage={headerImage} name={name} createdAt={createdAt} />
        <div className="flex items-center gap-2 flex-wrap justify-start">
          <LikeButton performancePostId={performancePostId} numLikes={numLikes} />
          <ViewButton steamAppId={steamAppId} performancePostId={performancePostId} />
          <EditButton
            steamAppId={steamAppId}
            performancePostId={performancePostId}
            userWhoCreated={{ steamUserId64 }}
          />
          <SystemSpecsPopover systemSpec={systemSpec} giveButtonStyles />
        </div>
      </div>
      <p className="text-primary-highlight">
        {postText}
      </p>
      <div>
        <PerformancePostTierRankContainer rating={rating} postTags={postTags} />
      </div>
    </div>
  );
}
