import { Link } from '@remix-run/react';
import AppHeaderImage from '~/components/ImageWrappers/AppHeaderImage';
import PerformancePostMetaBar from '~/components/AppInfo/PerformancePosts/PerformancePostMetaBar';
import Heading from '~/components/Heading';
import type { RatingMedal, FrameRate } from '~/interfaces/database';

interface UsersPostsLayoutProps {
  steamUsersPosts: {
    id: string;
    steamAppId: number;
    createdAt: Date;
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

export default function UsersPostsLayout({
  steamUsersPosts,
}: UsersPostsLayoutProps) {
  return (
    <div className="flex flex-col gap-8 items-center w-full p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
      <Heading>Posts</Heading>
      {steamUsersPosts.map(({
        id,
        steamAppId,
        createdAt,
        ratingMedal,
        postText,
        frameRateAverage,
        frameRateStutters,
        steamApp: {
          name,
          headerImage,
        },
      }) => (
        <Link
          to={`/apps/${steamAppId}/performance-posts#${id}`}
          key={id}
          className="border-1 border-secondary-highlight rounded-md
                   p-3 md:px-4 md:py-3 bg-tertiary hover:bg-tertiary-highlight
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
                <div>
                  <span className="font-semibold">
                    {name}
                  </span>
                  {` - `}<i className="italic">{ratingMedal}</i>
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
              />
            </div>
          </div>


          {/* Small- Screens */}
          <div
            className="md:hidden flex flex-col gap-2 justify-center w-full"
          >
            <div className="flex flex-col justify-center">
              <div>
                <span className="font-semibold">
                  {name}
                </span>
                {` - `}<i className="italic">{ratingMedal}</i>
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
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
