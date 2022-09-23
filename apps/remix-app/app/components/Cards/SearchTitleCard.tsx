import { Link } from '@remix-run/react';

interface SearchTitleCardProps {
  name: string;
  steamAppId: number;
  releaseDate?: string | null;
  headerImageSrc?: string | null;
}

export default function SearchTitleCard({
  steamAppId,
  name,
  headerImageSrc,
  releaseDate,
}: SearchTitleCardProps) {
  return (
    <Link
      to={`/apps/${steamAppId}/performance-posts`}
    >
      <div className={`p-1 md:p-2 bg-primary hover:bg-primary-highlight rounded-lg
                       flex flex-col gap-2 items-center max-w-[460px]
                     `}>
        {headerImageSrc && (
          <div className="rounded-lg flex items-center justify-center max-w-[464px]">
            <img
              src={headerImageSrc}
              alt={`Header for ${name}`}
              width={460}
              height={215}
              className="rounded-md"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
              }}
            />
          </div>
        )}
        <div className="flex flex-col flex-wrap justify-between w-full px-2">
          {releaseDate && (
            <span className="hidden md:inline text-sm">
              Released:&nbsp;
              <i className="italic">{releaseDate}</i>
            </span>
          )}
          <span>
            {name}
          </span>
        </div>
      </div>
    </Link>
  );
}
