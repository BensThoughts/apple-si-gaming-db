import type { SteamAppWithoutMetadata } from '~/interfaces/database';
import { Link } from '@remix-run/react';

export default function OwnedAppDisplay({
  name,
  steamAppId,
  headerImgSrc,
  className = '',
}: {
  name: SteamAppWithoutMetadata['name'];
  steamAppId: SteamAppWithoutMetadata['steamAppId'];
  headerImgSrc: SteamAppWithoutMetadata['headerImage']
  className?: string;
}) {
  return (
    <Link
      to={`/apps/${steamAppId}`}
      className={`flex flex-col justify-center items-center gap-1 bg-primary p-2
                  hover:bg-primary-highlight rounded-lg w-full md:max-w-[210px]
                  ${className}`}
    >
      <div
        className='w-[276px] md:w-[184px] whitespace-nowrap overflow-hidden text-ellipsis'
        aria-label={name}
      >
        {name}
      </div>
      {headerImgSrc ? (
        <div className={`rounded-lg flex items-center justify-center
                         w-[276px] md:w-[184px] h-[129px] md:h-[86px]
                         max-w-[464px]`}>
          <img
            src={headerImgSrc}
            alt={`Header for ${name}`}
            width={460}
            height={215}
            className='rounded-md'
            loading='lazy'
            onError={(e) => {
              e.currentTarget.src = '/no-image-placeholder.svg';
            }}
          />
        </div>
      ): (
        <div className={`rounded-lg flex items-center justify-center
                         w-[276px] md:w-[184px] h-[129px] md:h-[86px]
                         max-w-[464px]`}>
          <img
            src='/no-image-placeholder.svg'
            alt={`Header for ${name}`}
            width={460}
            height={215}
            className='rounded-md'
            loading='lazy'
            onError={(e) => {
              e.currentTarget.src = '/no-image-placeholder.svg';
            }}
          />
        </div>
      )}
    </Link>
  );
}
