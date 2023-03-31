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
                  hover:bg-tertiary-highlight rounded-xl w-full md:max-w-[210px]
                   focus-visible:show-ring-app-bg group/small-app-card hover:scale-105 duration-300 ease-in-out
                  ${className}`}
    >
      <div
        className={`w-[276px] md:w-[184px] whitespace-nowrap overflow-hidden
                    text-ellipsis text-primary-highlight`}
        aria-label={name}
      >
        {name}
      </div>
      <div className="relative
                        rounded-xl overflow-hidden before:-skew-x-12
                         before:absolute before:inset-0 before:-translate-x-full
                         group-hover/small-app-card:before:animate-shimmer
                         before:bg-gradient-to-r before:from-transparent
                         before:via-white/10 before:to-transparent transition-all
                         ease-in-out duration-300">
        <AppHeaderImage headerImageSrc={headerImgSrc} name={name} className="rounded-xl" />
      </div>

    </Link>
  );
}
