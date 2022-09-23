// import { RatingMedalIcon } from '~/components/Icons';
import type {
  PerformancePost,
  SteamUser,
} from '~/interfaces/database';
import PerformancePostMetaBar from './PerformancePostMetaBar';
import SystemSpecsPopover from './SystemSpecsPopover';
// import { convertRatingMedalToNumber } from '~/interfaces/database';

type PerformancePostProps =
  Pick<PerformancePost, 'postText' | 'ratingMedal' | 'createdAt'> &
  Pick<SteamUser, 'avatarMedium' | 'displayName'> &
  React.HTMLAttributes<HTMLDivElement>

export default function PerformancePostDisplay({
  displayName,
  avatarMedium,
  createdAt,
  postText,
  ratingMedal,
  ...rest
}: PerformancePostProps) {
  // const ratingNum = convertRatingMedalToNumber(ratingMedal);
  return (
    <div className="flex flex-col w-full gap-3">
      <PerformancePostMetaBar createdAt={createdAt} ratingMedal={ratingMedal} />
      <div className="flex flex-row w-full gap-[1px]" {...rest}>
        <div className="flex flex-col items-center justify-center pr-3 border-r-2 border-r-secondary">
          {avatarMedium && (
            <div>
              <img
                src={avatarMedium}
                alt="avatar"
                width={64}
                height={64}
                onError={(e) => {
                  e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
                }}
              />
            </div>
          )}
          <span className="text-sm">{displayName}</span>
          <SystemSpecsPopover />
        </div>
        <div className="border-l-1 border-l-secondary-highlight pl-3">
          {postText}
          {/* {Array(ratingNum).fill(<RatingMedalIcon />)} */}
        </div>
      </div>
    </div>
  );
}
