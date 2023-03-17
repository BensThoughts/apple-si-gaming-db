import { Link } from '@remix-run/react';
import type {
  PerformancePost,
} from '~/interfaces';
import AvatarImage from '~/components/ImageWrappers/AvatarImage';

type NewPerformancePostCardProps =
  Omit<PerformancePost, 'postTags' | 'systemSpec' | 'numLikes'>

export default function NewPerformancePostCard({
  performancePostId,
  steamApp,
  postText,
  userWhoCreated,
  rating,
}: NewPerformancePostCardProps) {
  const {
    displayName,
    avatarFull,
  } = userWhoCreated;
  const {
    ratingMedal,
  } = rating;
  return (
    <Link
      to={`/apps/${steamApp.steamAppId}/posts#${performancePostId}`}
      className="border-1 border-secondary-highlight rounded-md
                 p-4 bg-tertiary hover:bg-tertiary-highlight
                 focus:show-ring w-[20rem] md:w-[36rem] h-[165px]
                 flex items-center justify-start whitespace-normal"
    >
      {/* Medium+ Screens */}
      <div className="hidden md:flex items-center gap-2 w-full h-full">
        <div className="flex flex-col items-center justify-center gap-2 w-full max-w-[8rem]">
          {avatarFull && (
            // <div className="border-1 border-secondary-highlight rounded-full">
            <div className="w-[84px] h-[84px]">
              <AvatarImage avatarFull={avatarFull} />
            </div>
            // </div>
          )}
          <i className="italic truncate text-sm">{displayName}</i>
        </div>
        <div className="flex flex-col gap-2 self-start text-sm w-full">
          <div>
            <span className="font-semibold">
              {steamApp.name}
            </span>
            {` - `}<i className="italic">{ratingMedal}</i>
          </div>
          <div className="line-clamp-3 text-left">
            {postText}
          </div>
        </div>
      </div>

      {/* Small- Screens */}
      <div
        className="md:hidden flex flex-col gap-2 justify-center items-center w-full"
      >
        <div className="flex flex-col justify-center items-center w-full">
          <div>
            <span className="font-semibold">
              {steamApp.name}
            </span>
            {` - `}<i className="italic">{ratingMedal}</i>
          </div>
          <div>
            <i className="italic text-sm">{displayName}</i>
          </div>
        </div>
        <div className="line-clamp-3">
          {postText}
        </div>
      </div>
    </Link>
  );
}
