import type { PerformancePost, SteamUser } from '~/interfaces/database';
import PerformancePostDisplay from './PerformancePostDisplay';

type PerformancePostLayoutProps =
{
  performancePosts: {
    id: PerformancePost['id']
    postText: PerformancePost['postText'],
    steamUser: {
      displayName: SteamUser['displayName'],
      avatarMedium: SteamUser['avatarMedium'],
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
          {performancePosts.map(({
            id,
            steamUser,
            postText,
          }) => (
            <div key={id}>
              <PerformancePostDisplay
                postText={postText}
                displayName={steamUser.displayName}
                avatarMedium={steamUser.avatarMedium}
              />
            </div>
          ))}
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
