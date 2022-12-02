import { Link } from '@remix-run/react';
import type { RatingMedal } from '~/interfaces';

interface NewPerformancePostCardProps {
  steamAppId: number;
  postId: string;
  steamApp: {
    name: string;
  };
  postText: string;
  avatarMedium: string | null;
  displayName: string | null;
  ratingMedal: RatingMedal;
}

export default function NewPerformancePostCard({
  steamAppId,
  postId,
  steamApp,
  postText,
  avatarMedium,
  displayName,
  ratingMedal,
}: NewPerformancePostCardProps) {
  return (
    <Link
      to={`/apps/${steamAppId}/performance-posts#${postId}`}
      className="border-1 border-secondary-highlight rounded-md
                 p-4 bg-tertiary hover:bg-tertiary-highlight
                 focus:show-ring w-full max-w-xl h-full max-h-[165px]
                 flex items-center justify-start"
    >
      {/* Medium+ Screens */}
      <div className="hidden md:flex items-center gap-2 w-full h-full">
        <div className="flex flex-col items-center justify-center gap-2 w-full max-w-[8rem]">
          {avatarMedium && (
            // <div className="border-1 border-secondary-highlight rounded-full">
            <div className="w-[64px] h-[64px] rounded-full">
              <img
                src={avatarMedium}
                alt={`Avatar for ${displayName}`}
                width={64}
                height={64}
                className="rounded-full"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
                }}
              />
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
          <div className="line-clamp-3">
            {postText}
          </div>
        </div>
      </div>

      {/* Small- Screens */}
      <div
        className="md:hidden flex flex-col gap-2 justify-center"
      >
        <div className="flex flex-col justify-center">
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
