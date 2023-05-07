import { Link } from '@remix-run/react';
import type { TrendingSteamApp } from '~/types/remix-app';
import AppHeaderImage from '~/components/ImageWrappers/AppHeaderImage';
import { useEffect, useRef, useState } from 'react';
import { classNames } from '~/lib/css/classNames';

type TrendingSteamAppProps = TrendingSteamApp & {
  reversed: boolean;
};

export default function TrendingSteamAppCard({
  steamAppId,
  name,
  headerImage, // 460W x 215H
  numPerformancePosts,
  reversed,
}: TrendingSteamAppProps) {
  const intersectionRef: any = useRef<HTMLAnchorElement>();
  const onScreen = useOnScreen<HTMLAnchorElement>(intersectionRef, '-80px');

  return (
    <Link
      ref={intersectionRef}
      to={`/apps/${steamAppId}/posts`}
      tabIndex={onScreen ? 0 : -1}
      className={classNames(
          'h-auto relative rounded-2xl overflow-hidden transition-all ease-in-out',
          'duration-300 hover:rotate-0 hover:scale-110 bg-tertiary hover:bg-tertiary-highlight',
          'hover:shadow-lg lg:hover:shadow-xl group/app-card w-[15rem] md:w-[20rem] pb-2',
          'focus-visible:show-ring-app-bg',
          reversed ? 'rotate-[2deg]' : 'rotate-[-2deg]',
      )}
    >
      {headerImage && (
        // <div className="w-full max-w-[15rem] rounded-full">
        <div
          className="h-auto relative rounded-2xl overflow-hidden before:-skew-x-12
                     before:absolute before:inset-0 before:-translate-x-full
                     group-hover/app-card:before:animate-[shimmer_1s_forwards]
                     before:bg-gradient-to-r before:from-transparent
                     before:via-white/10 before:to-transparent transition-all
                     ease-in-out duration-300 group-hover/app-card:scale-105"
        >
          <AppHeaderImage
            headerImageSrc={headerImage}
            name={name}
            loading="eager"
            className="h-full w-full flex object-cover
                       rounded-2xl bg-gray"
          />
        </div>
        // </div>
      )}
      <div className="flex flex-col md:flex-row justify-between md:self-start w-full
                      ease-in-out duration-300 group-hover/app-card:scale-105 px-4 pt-2">
        <div className="text-center md:text-right justify-self-start font-semibold">
          {name}
        </div>
        <div className="text-center md:text-right justify-self-end">
          <span className="text-primary-highlight font-semibold">
            {numPerformancePosts}
          </span>
          <span className="text-primary-faded text-sm italic">
            {` `}Post{numPerformancePosts > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}

function useOnScreen<T extends Element>(ref: React.MutableRefObject<T>, rootMargin: string = '0px'): boolean {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState<boolean>(false);
  useEffect(() => {
    const current = ref.current;
    const observer = new IntersectionObserver(
        ([entry]) => {
        // Update our state when observer callback fires
          setIntersecting(entry.isIntersecting);
        },
        {
          rootMargin,
        },
    );
    if (current) {
      observer.observe(current);
    }
    return () => {
      observer.unobserve(current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return isIntersecting;
}
