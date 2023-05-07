import type { PerformancePost } from '~/types/remix-app';
import TierRankContainer from '~/components/PerformancePostCards/CardComponents/TierRankContainer';
import EditButton from '~/components/Buttons/EditButton';
import SystemSpecsPopover from '~/components/HeadlessComponents/SystemSpecPopover';
import LikeButton from '~/components/Buttons/LikeButton';
import PerformancePostAppBadge from '~/components/PerformancePostCards/CardComponents/AppBadge';
import ViewButton from '~/components/Buttons/ViewButton';
import HTMLContainer from './CardComponents/HTMLContainer';

export default function PerformancePostCardWithSteamAppBadge({
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
    postHTML,
    steamApp: {
      steamAppId,
      headerImage,
      name,
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
          <SystemSpecsPopover systemSpec={systemSpec} paddingY={8} giveButtonStyles />
        </div>
      </div>
      <HTMLContainer htmlString={postHTML ? postHTML : postText} />
      <div>
        <TierRankContainer rating={rating} postTags={postTags} />
      </div>
    </div>
  );
}
