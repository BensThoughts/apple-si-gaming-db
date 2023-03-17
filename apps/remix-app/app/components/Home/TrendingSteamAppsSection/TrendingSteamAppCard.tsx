import { Link } from '@remix-run/react';
import type { TrendingSteamApp } from '~/interfaces';
import AppHeaderImage from '~/components/ImageWrappers/AppHeaderImage';

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
  return (
    <Link
      to={`/apps/${steamAppId}/posts`}
      // className="flex flex-col md:flex-row gap-8 md:gap-2 items-center px-2 py-8 md:p-2 bg-tertiary
      //            border-1 border-secondary-highlight rounded-md hover:bg-tertiary-highlight
      //            focus-visible:show-ring w-[20rem] md:w-[36rem] h-[140px]
      //            max-w-xl group/app-card"
      className={`h-auto relative rounded-2xl overflow-hidden transition-all ease-in-out
                 duration-300 hover:rotate-0 hover:scale-110 bg-tertiary hover:bg-tertiary-highlight
                 hover:shadow-lg lg:hover:shadow-xl group/app-card w-[15rem] md:w-[20rem] pb-2
                 ${reversed ? 'rotate-[2deg]' : 'rotate-[-2deg]'}`}
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
