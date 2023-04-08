import EditButton from '~/components/Buttons/EditButton';
import LikeButton from '~/components/Buttons/LikeButton';
import SystemSpecsPopover from '~/components/HeadlessComponents/SystemSpecPopover';
import type { PerformancePost } from '~/interfaces';

export default function ButtonContainer({
  performancePostId,
  numLikes,
  systemSpec,
  steamApp: { steamAppId },
  userWhoCreated,
}: {
  performancePostId: PerformancePost['performancePostId'];
  numLikes: PerformancePost['numLikes'];
  systemSpec: PerformancePost['systemSpec'];
  steamApp: {
    steamAppId: PerformancePost['steamApp']['steamAppId'];
  };
  userWhoCreated: {
    steamUserId64: PerformancePost['userWhoCreated']['steamUserId64'];
  };
}) {
  return (
    <div className="flex items-center gap-2">
      <LikeButton performancePostId={performancePostId} numLikes={numLikes} />
      <SystemSpecsPopover systemSpec={systemSpec} giveButtonStyles />
      <EditButton
        steamAppId={steamAppId}
        performancePostId={performancePostId}
        userWhoCreated={userWhoCreated}
      />
    </div>
  );
}
