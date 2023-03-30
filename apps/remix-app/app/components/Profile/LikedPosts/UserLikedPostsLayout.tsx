import AppHeaderImage from '~/components/ImageWrappers/AppHeaderImage';
import PerformancePostMetaBar from '~/components/AppInfo/PerformancePosts/PerformancePostMetaBar';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type { PerformancePostForUserProfileDisplay } from '~/interfaces';

interface UserLikedPostsLayoutProps {
  likedPosts: PerformancePostForUserProfileDisplay[]
}

export default function UserLikedPostsLayout({
  likedPosts,
}: UserLikedPostsLayoutProps) {
  if (likedPosts.length < 1) {
    return (
      <div className="max-w-max p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
          You haven't liked any posts yet. Like posts to see them appear here.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {likedPosts.map(({
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
      }) => (
        <div
          key={performancePostId}
          className="rounded-md p-3 md:px-4 md:py-3 bg-tertiary focus:show-ring
                     w-full max-w-4xl flex items-center justify-start"
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
