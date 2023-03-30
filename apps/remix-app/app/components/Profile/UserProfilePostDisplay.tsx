import type { PerformancePostForUserProfileDisplay } from '~/interfaces';
import PerformancePostMetaBar from '../AppInfo/PerformancePosts/PerformancePostMetaBar';
import AppHeaderImage from '../ImageWrappers/AppHeaderImage';
import RemixUnderlineLink from '../RemixUnderlineLink';

export default function UserProfilePostDisplay({
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
      className="rounded-md p-3 md:px-4 md:py-3 bg-tertiary focus:show-ring
                 w-full max-w-4xl flex items-center justify-start"
    >
      {/* Medium+ Screens */}
      <div className="hidden md:flex md:flex-col md:gap-4 md:w-full">

        <div className="flex gap-4 w-full h-full">
          {headerImage && (
            <div className="w-full max-w-[12rem] self-start">
              <AppHeaderImage headerImageSrc={headerImage} name={name} />
            </div>
          )}
          <div className="flex flex-col gap-2 text-sm w-full">
            <div className="flex justify-between">
              <div>
                <span className="font-semibold">
                  {name}
                </span>
                {` - `}<i className="italic">{ratingMedal}</i>
              </div>
              <div>
                <RemixUnderlineLink
                  to={`/apps/${steamAppId}/posts#${performancePostId}`}
                >
                View
                </RemixUnderlineLink>
              </div>
            </div>
            <div className="line-clamp-3">
              {postText}
            </div>
          </div>
        </div>
        <div className="w-full">
          <PerformancePostMetaBar
            performancePostMetadata={{
              performancePostId,
              createdAt,
              steamApp: { steamAppId },
              userWhoCreated: { steamUserId64 },
              rating: {
                ratingMedal,
                frameRateAverage,
                frameRateStutters,
              },
              numLikes,
            }}
          />
        </div>
      </div>


      {/* Small- Screens */}
      <div
        className="md:hidden flex flex-col gap-2 justify-center w-full"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="font-semibold">
              {name}
            </span>
            {` - `}<i className="italic">{ratingMedal}</i>
          </div>
          <div>
            <RemixUnderlineLink
              to={`/apps/${steamAppId}/posts#${performancePostId}`}
            >
                View
            </RemixUnderlineLink>
          </div>
        </div>
        <div className="line-clamp-4">
          {postText}
        </div>
        <div className="w-full">
          <PerformancePostMetaBar
            performancePostMetadata={{
              performancePostId,
              createdAt,
              steamApp: { steamAppId },
              userWhoCreated: { steamUserId64 },
              rating: {
                ratingMedal,
                frameRateAverage,
                frameRateStutters,
              },
              numLikes,
            }}
          />
        </div>
      </div>
    </div>
  );
}
