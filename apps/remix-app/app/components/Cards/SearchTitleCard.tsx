import { Link } from '@remix-run/react';
import type { PrismaSteamAppData } from '~/interfaces';

interface SearchTitleCardProps extends Pick<PrismaSteamAppData, 'name' | 'steamAppId'> {
  headerImageSrc: PrismaSteamAppData['headerImage'];
}

export default function SearchTitleCard({
  headerImageSrc,
  name,
  steamAppId,
}: SearchTitleCardProps) {
  return (
    <Link
      to={`/apps/${steamAppId}`}
      className="block w-full"
    >
      <div className="w-full p-4 bg-primary hover:bg-primary-highlight flex md:flex-row flex-col justify-center items-center md:items-start rounded-md">
        <div className="w-[292px] h-[136px]">
          {headerImageSrc && <img
            src={headerImageSrc}
            alt={`Header for ${name}`}
            // layout="fixed"
            width={292}
            height={136}
          />}
        </div>
        <div className="w-full text-center">
          <h1>{name}</h1>
        </div>
      </div>
    </Link>
  );
}
