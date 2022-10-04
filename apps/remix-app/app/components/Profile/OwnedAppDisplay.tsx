import { Link } from '@remix-run/react';

export default function OwnedAppDisplay({
  name,
  steamAppId,
  headerImgSrc,
  className = '',
}: {
  name: string;
  steamAppId: number;
  headerImgSrc: string | undefined | null;
  className?: string;
}) {
  return (
    <Link
      to={`/apps/${steamAppId}/performance-posts`}
      className={`flex flex-col justify-center items-center gap-1 bg-tertiary p-2
                  hover:bg-tertiary-highlight rounded-lg w-full md:max-w-[210px]
                  border-1 border-secondary-highlight
                  ${className}`}
    >
      <div
        className={`w-[276px] md:w-[184px] whitespace-nowrap overflow-hidden
                    text-ellipsis text-primary-highlight`}
        aria-label={name}
      >
        {name}
      </div>
      {headerImgSrc ? (
        <div className={`rounded-lg flex items-center justify-center
                         max-w-[276px] md:max-w-[184px] max-h-[129px]
                         md:max-h-[86px]`}>
          <img
            src={headerImgSrc}
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
      ): (
        <div className={`rounded-lg flex items-center justify-center
                         max-w-[276px] md:max-w-[184px] max-h-[129px]
                         md:max-h-[86px]`}>
          <img
            src="/svg-images/no-image-placeholder.svg"
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
    </Link>
  );
}
