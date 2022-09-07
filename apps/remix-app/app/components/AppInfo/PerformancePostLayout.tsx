import type { PrismaPerformancePost, PrismaSteamUser } from '~/interfaces';

type PerformancePostLayoutProps =
{
  performancePosts: {
    postText: PrismaPerformancePost['postText'],
    steamUser: {
      displayName: PrismaSteamUser['displayName'],
      avatarMedium: PrismaSteamUser['avatarMedium'],
    }
  }[]
}

export default function PerformancePostLayout({
  performancePosts,
}: PerformancePostLayoutProps) {
  return (
    <div className={`flex flex-col items-center justify-center w-full
                     bg-primary border-solid border-2 border-secondary
                     p-3 rounded-lg`}>
      {performancePosts.length > 0 ? (
        <div>
          There are some posts.
        </div>
      ): (
        <div>
          There are currently no performance posts for this app. If you own this app you can
          submit one with the form at the bottom of this page.
        </div>
      )}
    </div>
  );
}
