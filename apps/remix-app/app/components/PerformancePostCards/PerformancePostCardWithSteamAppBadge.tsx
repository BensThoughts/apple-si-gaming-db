import type { PerformancePost } from '~/types/remix-app';
import TierRankContainer from '~/components/PerformancePostCards/CardComponents/TierRankContainer';
import EditButton from '~/components/Buttons/EditButton';
import SystemSpecsPopover from '~/components/HeadlessComponents/SystemSpecPopover';
import LikeButton from '~/components/Buttons/LikeButton';
import PerformancePostAppBadge from '~/components/PerformancePostCards/CardComponents/AppBadge';
import ViewButton from '~/components/Buttons/ViewButton';
import HTMLContainer from './CardComponents/HTMLContainer';

function ButtonContainer({
  steamAppId,
  performancePostId,
  userWhoCreated,
  numLikes,
  systemSpec,
}: {
  steamAppId: number;
  performancePostId: number;
  userWhoCreated: { steamUserId64: string };
  numLikes: number;
  systemSpec: PerformancePost['systemSpec'];
}) {
  return (
    <div className="flex items-center gap-2 justify-start flex-wrap">
      <LikeButton performancePostId={performancePostId} numLikes={numLikes} />
      <ViewButton steamAppId={steamAppId} performancePostId={performancePostId} />
      <EditButton
        steamAppId={steamAppId}
        performancePostId={performancePostId}
        userWhoCreated={userWhoCreated}
      />
      <SystemSpecsPopover systemSpec={systemSpec} paddingY={8} giveButtonStyles />
    </div>
  );
}

export default function PerformancePostCardWithSteamAppBadge({
  performancePost,
}: {
  performancePost: PerformancePost;
}) {
  const {
    performancePostId,
    createdAt,
    userWhoCreated,
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
      className="px-3 py-4 md:px-4 rounded-lg bg-tertiary w-full flex
                 flex-col gap-y-4 items-start justify-center"
    >
      <div className="w-full flex justify-between flex-wrap gap-y-4 gap-x-2">
        <PerformancePostAppBadge
          headerImage={headerImage}
          name={name}
          createdAt={createdAt}
        />
        <ButtonContainer
          steamAppId={steamAppId}
          performancePostId={performancePostId}
          userWhoCreated={userWhoCreated}
          numLikes={numLikes}
          systemSpec={systemSpec}
        />
      </div>
      <HTMLContainer htmlString={postHTML ? postHTML : postText} />
      <TierRankContainer rating={rating} postTags={postTags} />
    </div>
  );
}
