import type { TrendingSteamApp } from '~/types/remix-app';
import TrendingSteamAppCard from './TrendingSteamAppCard';

export default function TrendingSteamAppsSection({
  trendingSteamApps,
}: {
  trendingSteamApps: TrendingSteamApp[]
}) {
  const MINIMUM_NUMBER_OF_APPS = 12; // won't display right without at least
  if (trendingSteamApps.length < MINIMUM_NUMBER_OF_APPS) {
    return null;
  }
  return (
    <section className="flex flex-col items-center gap-0 w-full">
      <h2 className="sr-only">Trending Apps</h2>
      <div className="relative flex overflow-x-hidden overflow-y-visible group max-w-[100vw]">
        <div className="flex py-12 whitespace-nowrap animate-marquee lg:animate-large-marquee
                        group-hover:pause group-focus-within:pause will-change-transform">
          {trendingSteamApps.map(({
            steamAppId,
            name,
            headerImage,
            numPerformancePosts,
          }, idx) => (
            <div key={steamAppId} className="flex justify-center relative px-8">
              <TrendingSteamAppCard
                steamAppId={steamAppId}
                name={name}
                headerImage={headerImage}
                numPerformancePosts={numPerformancePosts}
                reversed={idx % 2 === 1 ? true : false}
              />
            </div>
          ))}
        </div>
        <div className="flex absolute top-0 whitespace-nowrap py-12 animate-marquee2
                        lg:animate-large-marquee2 group-hover:pause group-focus-within:pause
                        will-change-transform">
          {trendingSteamApps.map(({
            steamAppId,
            name,
            headerImage,
            numPerformancePosts,
          }, idx) => (
            <div key={steamAppId} className="flex justify-center relative px-8">
              <TrendingSteamAppCard
                steamAppId={steamAppId}
                name={name}
                headerImage={headerImage}
                numPerformancePosts={numPerformancePosts}
                reversed={idx % 2 === 1 ? true : false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
