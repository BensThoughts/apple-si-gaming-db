import AppHeaderImage from '~/components/ImageWrappers/AppHeaderImage';
import PerformancePostMetaBar from '~/components/AppInfo/PerformancePosts/PerformancePostMetaBar';
import Heading from '~/components/Heading';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type {
  UserProfilePerformancePost,
} from '~/interfaces';

interface UsersPostsLayoutProps {
  steamUsersPosts: UserProfilePerformancePost[];
}

export default function UsersPostsLayout({
  steamUsersPosts,
}: UsersPostsLayoutProps) {
  if (steamUsersPosts.length < 1) {
    return (
      <div className="flex flex-col gap-8 items-center w-full p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
        <div><Heading>Posts</Heading></div>
        <div className="w-full max-w-sm">
          <span>
            It look like you haven't posted yet.  Post a report for a game in your{` `}
            <RemixUnderlineLink
              to="/profile/library"
            >
              library
            </RemixUnderlineLink>
            {` `}to see it appear here.
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8 items-center w-full p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
      <Heading>Posts</Heading>
      {steamUsersPosts.map(({
        performancePostId,
        createdAt,
        postText,
        numLikes,
        rating: {
          ratingMedal,
          frameRateAverage,
          frameRateStutters,
        },
        steamApp: {
          steamAppId,
          name,
          headerImage,
        },
        userWhoCreated: {
          steamUserId64,
        },
      }) => (
        <div
          key={performancePostId}
          className="md:border-1 md:border-secondary-highlight rounded-md
                   p-3 md:px-4 md:py-3 bg-tertiary
                   focus:show-ring w-full max-w-4xl
                   flex items-center justify-start"
        >
          {/* Medium+ Screens */}
          <div className="hidden md:flex md:flex-col md:gap-4 md:w-full">

            <div className="flex gap-4 w-full h-full">
              {headerImage && (
                // <div className="border-1 border-secondary-highlight rounded-full">
                <div className="w-full max-w-[12rem] self-start">
                  <AppHeaderImage headerImageSrc={headerImage} name={name} />
                </div>
                // </div>
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
                    View Post
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
                performancePostId={performancePostId}
                createdAt={createdAt}
                steamApp={{ steamAppId }}
                userWhoCreated={{ steamUserId64 }}
                rating={{ ratingMedal, frameRateAverage, frameRateStutters }}
                numLikes={numLikes}
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
                performancePostId={performancePostId}
                createdAt={createdAt}
                steamApp={{ steamAppId }}
                userWhoCreated={{ steamUserId64 }}
                rating={{ ratingMedal, frameRateAverage, frameRateStutters }}
                numLikes={numLikes}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
