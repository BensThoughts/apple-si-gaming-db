import { Link } from '@remix-run/react';
import type { PerformancePostForUserProfileDisplay } from '~/interfaces';
import PerformancePostMetaBar from '../AppInfo/PerformancePosts/PerformancePostMetaBar';
import EditButton from '../AppInfo/PerformancePosts/PerformancePostMetaBar/EditButton';
import AppHeaderImage from '../ImageWrappers/AppHeaderImage';
import LikeButton from '../LikeButton';

export default function UserProfilePostDisplayV2({
  performancePost,
}: {
  performancePost: PerformancePostForUserProfileDisplay;
}) {
  const {
    performancePostId,
    createdAt,
    userWhoCreated: {
      steamUserId64,
    },
    numLikes,
    rating: {
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
    },
    postText,
    steamApp: {
      steamAppId,
      name,
      headerImage,
    },
  } = performancePost;
  return (
    <div
      id={performancePostId.toString()}
      className="rounded-xl px-0 py-0 pb-4 bg-tertiary focus:show-ring
                 w-full max-w-sm flex items-center justify-center"
    >
      <div
        className="flex flex-col gap-3 items-center w-full"
      >
        <div className="flex flex-col gap-1">
          <AppHeaderImage
            headerImageSrc={headerImage}
            name={name}
            className="h-full w-full flex justify-center object-cover
                         bg-tertiary rounded-t-xl rounded-b-none"
          />
          <span className="font-semibold self-start pl-2">
            {name}
          </span>
        </div>

        <div className="flex justify-between w-full px-2">
          <LikeButton performancePostId={performancePostId} numLikes={numLikes} />
          <EditButton
            steamAppId={steamAppId}
            performancePostId={performancePostId}
          />
        </div>
        <Link
          to={`/apps/${steamAppId}/posts#${performancePostId}`}
          className="p-2 group flex flex-col gap-3 w-full"
        >
          <div className="flex justify-between w-full">
            <span className="text-secondary font-medium relative px-0 py-[0.1em]
                  after:block after:absolute after:bottom-[-3px] after:left-0
                  after:w-0 after:h-[0.2em] after:bg-secondary after:transition-all
                  group-hover:after:w-full after:rounded-full
                  after:duration-200">
              <span>
                    View
              </span>
            </span>
          </div>
          <p className="line-clamp-4">
            {postText}
          </p>
          <div className="bg-primary flex flex-col gap-2 w-full">
            <span className="font-semibold">
              {ratingMedal}
            </span>
            <span>
              {frameRateAverage}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
