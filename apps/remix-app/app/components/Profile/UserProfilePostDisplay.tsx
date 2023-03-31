import { Link } from '@remix-run/react';
import type { PerformancePostForUserProfileDisplay } from '~/interfaces';
import PerformancePostMetaBar from '../AppInfo/PerformancePosts/PerformancePostMetaBar';
import AppHeaderImage from '../ImageWrappers/AppHeaderImage';

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
      className="rounded-xl px-0 py-0 pb-4 bg-tertiary focus:show-ring
                 w-full max-w-md lg:max-w-4xl flex items-center justify-start"
    >
      {/* Large+ Screens */}
      <div className="hidden lg:flex lg:flex-col lg:gap-0 lg:w-full">
        <Link
          to={`/apps/${steamAppId}/posts#${performancePostId}`}
          className="group rounded-t-xl p-3 bg-tertiary hover:bg-tertiary-highlight"
        >

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
                <span className="text-secondary font-medium relative px-0 py-[0.1em]
                  after:block after:absolute after:bottom-[-3px] after:left-0
                  after:w-0 after:h-[0.2em] after:bg-secondary after:transition-all
                  group-hover:after:w-full after:rounded-full
                  after:duration-200">
                  <span className="hidden lg:inline">
                    View Post
                  </span>
                  <span className="inline lg:hidden">
                    View
                  </span>
                </span>
              </div>
              <div className="line-clamp-3">
                {postText}
              </div>
            </div>
          </div>
        </Link>


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
        className="lg:hidden flex flex-col items-center w-full"
      >
        <Link
          to={`/apps/${steamAppId}/posts#${performancePostId}`}
          className="flex flex-col items-start gap-2 group p-0 bg-tertiary
                     hover:bg-tertiary-highlight rounded-t-xl"
        >
          <div className="h-auto max-w-lg">
            <AppHeaderImage
              headerImageSrc={headerImage}
              name={name}
              className="h-full w-full flex justify-center object-cover
                         bg-tertiary rounded-t-xl"
            />
          </div>
          <div className="flex flex-col gap-2 px-2 pb-2 w-full">
            <div className="flex justify-between items-center w-full">
              <div>
                <span className="font-semibold">
                  {name}
                </span>
                {` - `}<i className="italic">{ratingMedal}</i>
              </div>
              <div className="self-start">
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
            </div>

            <div className="line-clamp-4">
              {postText}
            </div>
          </div>

        </Link>

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
