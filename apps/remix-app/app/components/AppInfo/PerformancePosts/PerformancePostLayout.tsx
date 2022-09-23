import type { RatingMedal } from '~/interfaces/database';
import PerformancePostDisplay from './PerformancePostDisplay';

type PerformancePostLayoutProps =
{
  performancePosts: {
    id: string;
    postText: string;
    createdAt: Date;
    ratingMedal: RatingMedal;
    steamUser: {
      displayName: string | null,
      avatarMedium: string | null,
    };
  }[];
}

export default function PerformancePostLayout({
  performancePosts,
}: PerformancePostLayoutProps) {
  return (
    <div className={`grid grid-cols-1 w-full
                     bg-tertiary border-solid border-2 border-secondary
                     p-3 rounded-lg`}>
      {performancePosts.length > 0 ? (
        <div className="flex flex-col gap-6 w-full">
          {performancePosts.map(({
            id,
            steamUser,
            postText,
            ratingMedal,
            createdAt,
          }, idx) => (
            <div key={id} className="flex flex-col gap-6">
              <PerformancePostDisplay
                postText={postText}
                displayName={steamUser.displayName}
                avatarMedium={steamUser.avatarMedium}
                ratingMedal={ratingMedal}
                createdAt={createdAt}
              />
              {(performancePosts.length - 1 > idx) &&
                <hr className="text-secondary" />
              }
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
