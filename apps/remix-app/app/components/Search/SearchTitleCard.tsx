import { Link } from '@remix-run/react';
import AppHeaderImage from '../ImageWrappers/AppHeaderImage';

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
      to={`/apps/${steamAppId}/posts`}
      className="focus-visible:show-ring bg-tertiary hover:bg-tertiary-highlight
                 rounded-lg w-full max-w-xl focus-visible:bg-tertiary-highlight
                 border-1 border-secondary-highlight p-3 md:p-2 flex flex-col md:flex-row gap-2 items-center md:items-start"
    >

      <div className="w-full flex justify-center items-center">
        {headerImageSrc && (
          <div className="rounded-lg flex items-center justify-center max-w-lg">
            <AppHeaderImage headerImageSrc={headerImageSrc} name={name} />
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
    </Link>
  );
}
