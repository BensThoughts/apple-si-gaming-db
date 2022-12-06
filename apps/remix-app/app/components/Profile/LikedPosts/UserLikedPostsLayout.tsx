import AppHeaderImage from '~/components/ImageWrappers/AppHeaderImage';
import PerformancePostMetaBar from '~/components/AppInfo/PerformancePosts/PerformancePostMetaBar';
import Heading from '~/components/Heading';
import type { RatingMedal, FrameRate } from '~/interfaces/database';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';

interface UsersPostsLayoutProps {
  isUserLoggedIn: boolean;
  likedPerformancePostIds: string[];
  steamUsersPosts: {
    id: string;
    steamAppId: number;
    createdAt: Date;
    numLikes: number;
    ratingMedal: RatingMedal;
    frameRateAverage?: FrameRate | null;
    frameRateStutters?: boolean | null;
    postText: string;
    steamApp: {
      name: string;
      headerImage: string | null;
    }
  }[]
}

export default function UserLikedPostsLayout({
  isUserLoggedIn,
  likedPerformancePostIds,
  steamUsersPosts,
}: UsersPostsLayoutProps) {
  if (steamUsersPosts.length < 1) {
    return (
      <div className="flex flex-col gap-8 items-center w-full p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
        <Heading>Liked Posts</Heading>
        <span>
          It look like you haven't liked any posted yet. Like posts to see them appear here.
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8 items-center w-full p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
      <Heading>Liked Posts</Heading>
      {steamUsersPosts.map(({
        id,
        steamAppId,
        createdAt,
        numLikes,
        ratingMedal,
        postText,
        frameRateAverage,
        frameRateStutters,
        steamApp: {
          name,
          headerImage,
        },
      }) => (
        <div
          key={id}
          className="border-1 border-secondary-highlight rounded-md
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
                      to={`/apps/${steamAppId}/performance-posts#${id}`}
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
                ratingMedal={ratingMedal}
                frameRateAverage={frameRateAverage}
                frameRateStutters={frameRateStutters}
                createdAt={createdAt}
                likeButtonData={{
                  postId: id,
                  numLikes,
                  isUserLoggedIn,
                  hasLoggedInUserLiked: likedPerformancePostIds.includes(id),
                }}
              />
            </div>
          </div>


          {/* Small- Screens */}
          <div
            className="md:hidden flex flex-col gap-2 justify-center w-full"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">
                  {name}
                </span>
                {` - `}<i className="italic">{ratingMedal}</i>
              </div>
              <div>
                <RemixUnderlineLink
                  to={`/apps/${steamAppId}/performance-posts#${id}`}
                >
                    View Post
                </RemixUnderlineLink>
              </div>
            </div>
            <div className="line-clamp-4">
              {postText}
            </div>
            <div className="w-full">
              <PerformancePostMetaBar
                ratingMedal={ratingMedal}
                frameRateAverage={frameRateAverage}
                frameRateStutters={frameRateStutters}
                createdAt={createdAt}
                likeButtonData={{
                  postId: id,
                  numLikes,
                  isUserLoggedIn,
                  hasLoggedInUserLiked: likedPerformancePostIds.includes(id),
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
