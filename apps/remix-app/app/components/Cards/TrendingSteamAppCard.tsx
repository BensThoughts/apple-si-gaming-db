import { Link } from '@remix-run/react';
import type { TrendingSteamApp } from '~/interfaces';
import AppHeaderImage from '../ImageWrappers/AppHeaderImage';

type TrendingSteamAppProps = TrendingSteamApp;

export default function TrendingSteamAppCard({
  steamAppId,
  name,
  headerImage, // 460W x 215H
  numPerformancePosts,
}: TrendingSteamAppProps) {
  return (
    <Link
      to={`/apps/${steamAppId}/performance-posts`}
      className="flex flex-col md:flex-row gap-8 md:gap-2 items-center px-2 py-8 md:p-2 bg-tertiary
                 border-1 border-secondary-highlight rounded-md hover:bg-tertiary-highlight
                 focus-visible:show-ring w-full
                 max-w-xl"
    >
      {headerImage && (
        <div className="w-full max-w-[15rem]">
          <AppHeaderImage headerImageSrc={headerImage} name={name} />
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between md:self-start w-full">
        <div className="text-center md:text-right justify-self-start font-semibold">
          {name}
        </div>
        <div className="text-center md:text-right justify-self-end">
          <span className="text-primary-highlight font-semibold">
            {numPerformancePosts}
          </span>
          <span className="text-primary-faded text-sm italic">
            {` `}New Posts
          </span>
        </div>
      </div>
    </Link>
  );
}
