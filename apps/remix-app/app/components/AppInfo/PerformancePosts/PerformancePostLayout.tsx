import AppRatingOverview from './AppRatingOverview';
import PerformancePostDisplay from './PerformancePostDisplay';
import type {
  PerformancePostBase,
  PerformancePostSteamApp,
  PerformancePostRating,
  PerformancePostSystem,
  PerformancePostUserWhoCreated,
  PerformancePostTag,
  PerformancePostLikes,
} from '~/interfaces';

type PerformancePostLayoutProps =
{
  userSession: {
    isUserLoggedIn: boolean;
    steamUserId?: string;
    likedPerformancePostIds: string[];
  };
  performancePosts: (PerformancePostBase & {
    steamApp: PerformancePostSteamApp;
    rating: PerformancePostRating;
    likes: PerformancePostLikes;
    system: PerformancePostSystem;
    userWhoCreatedPost: PerformancePostUserWhoCreated;
    postTags: PerformancePostTag[];
  })[];
}

function PostLayoutCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 w-full
    bg-tertiary border-solid border-2 border-secondary
    p-3 rounded-lg"
    >
      {children}
    </div>
  );
}

export default function PerformancePostLayout({
  userSession,
  performancePosts,
}: PerformancePostLayoutProps) {
  if (performancePosts.length < 1) {
    return (
      <PostLayoutCard>
        There are currently no performance posts for this app. Use the form below to
        <strong className="font-semibold text-primary-highlight">
          {` `}become the first to submit!
        </strong>
      </PostLayoutCard>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <AppRatingOverview performancePostRatings={performancePosts.map((post) => post.rating)} />
      <PostLayoutCard>
        <div className="flex flex-col gap-6 w-full">
          {performancePosts.map((performancePost, idx) => {
            const hasLoggedInUserLiked =
              userSession.likedPerformancePostIds.includes(performancePost.postId);
            const didLoggedInUserCreatePost =
              performancePost.userWhoCreatedPost?.steamUserId === userSession.steamUserId;
            return (
              <div key={performancePost.postId} id={performancePost.postId} className="flex flex-col gap-6">
                <PerformancePostDisplay
                  performancePost={performancePost}
                  userSession={{
                    isUserLoggedIn: userSession.isUserLoggedIn,
                    hasLoggedInUserLiked,
                    didLoggedInUserCreatePost,
                  }}
                />
                {(performancePosts.length - 1 > idx) &&
                <hr className="text-secondary" />
                }
              </div>
            );
          })}
        </div>
      </PostLayoutCard>
    </div>
  );
}
