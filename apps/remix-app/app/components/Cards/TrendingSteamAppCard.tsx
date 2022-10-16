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
  headerImage,
  releaseDate,
  numNewPerformancePosts,
}: TrendingSteamAppProps) {
  return (
    <Link
      to={`/apps/${steamAppId}/performance-posts`}
      className="flex flex-col gap-2 items-center justify-center p-2 bg-tertiary
                 border-1 border-secondary-highlight rounded-md hover:bg-tertiary-highlight
                 focus-visible:show-ring w-full
                 max-w-md"
    >
      <div>
        {name}
        <span className="text-primary-faded">
          {` - `}New Posts:{` `}
        </span>
        <span className="text-secondary">
          {numNewPerformancePosts}
        </span>
      </div>
    </Link>
  );
}
