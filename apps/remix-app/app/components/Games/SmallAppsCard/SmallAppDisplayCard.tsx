import { Link } from '@remix-run/react';
import AppHeaderImage from '~/components/ImageWrappers/AppHeaderImage';

export default function SmallAppDisplayCard({
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
      to={`/apps/${steamAppId}/posts`}
      className={`flex flex-col justify-center items-center gap-1 bg-tertiary p-2
                  hover:bg-tertiary-highlight rounded-lg w-full md:max-w-[210px]
                  border-1 border-secondary-highlight focus-visible:show-ring
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
          <AppHeaderImage headerImageSrc={headerImgSrc} name={name} />
        </div>
      ): (
        <div className={`rounded-lg flex items-center justify-center
                         max-w-[276px] md:max-w-[184px] max-h-[129px]
                         md:max-h-[86px]`}>
          <AppHeaderImage headerImageSrc="/svg-images/no-image-placeholder.svg" name={name} />
        </div>
      )}
    </Link>
  );
}
