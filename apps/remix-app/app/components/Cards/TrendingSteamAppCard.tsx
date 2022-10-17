import { Link } from '@remix-run/react';

interface TrendingSteamAppProps {
  steamAppId: number;
  name: string;
  headerImage: string | null;
  releaseDate: string | null;
  numNewPerformancePosts: number;
}

export default function TrendingSteamAppCard({
  steamAppId,
  name,
  headerImage, // 460W x 215H
  releaseDate,
  numNewPerformancePosts,
}: TrendingSteamAppProps) {
  return (
    <Link
      to={`/apps/${steamAppId}/performance-posts`}
      className="flex flex-col md:flex-row gap-2 items-center p-2 bg-tertiary
                 border-1 border-secondary-highlight rounded-md hover:bg-tertiary-highlight
                 focus-visible:show-ring w-full
                 max-w-xl"
    >
      {headerImage && (
        <div className="w-full max-w-[15rem]">
          <img
            src={headerImage}
            alt={name}
            width={460}
            height={215}
          />
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between md:self-start w-full">
        <div className="text-center md:text-right justify-self-start font-semibold">
          {name}
        </div>
        <div className="text-center md:text-right justify-self-end">
          <span className="text-primary-highlight font-semibold">
            {numNewPerformancePosts}
          </span>
          <span className="text-primary-faded text-sm italic">
            {` `}New Posts
          </span>


        </div>
      </div>
    </Link>
  );
}
