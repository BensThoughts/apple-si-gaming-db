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
      className="focus-visible:show-ring bg-tertiary hover:bg-tertiary-highlight
                 rounded-lg w-full h-full max-w-lg focus-visible:bg-tertiary-highlight
                 block border-1 border-secondary-highlight"
    >
      <div
        className="p-1 md:p-2 flex flex-col md:flex-row gap-2 items-center md:items-start
        w-full max-w-lg"
      >

        <div>
          {headerImageSrc && (
            <div className="rounded-lg flex items-center justify-center max-w-lg">
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
        </div>
        <div className="flex flex-col flex-wrap gap-1 justify-between w-full px-2 md:text-right text-primary-highlight">
          {releaseDate && (
            <div className="text-sm order-1 md:order-2 italic text-primary-faded">
              Released:&nbsp;
              <i className="italic">{releaseDate}</i>
            </div>
          )}
          <div className="order-2 md:order-1 text-base text-secondary">
            {name}
          </div>
        </div>
      </div>
    </Link>
  );
}
