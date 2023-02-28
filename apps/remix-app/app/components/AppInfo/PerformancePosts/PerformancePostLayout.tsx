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
import PostLayoutCard from './PerformancePostLayoutCard';

type PerformancePostLayoutProps =
{
  userSession: {
    isUserLoggedIn: boolean;
    steamUserId64?: string;
    likedPerformancePostIds: number[];
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
              userSession.likedPerformancePostIds.includes(performancePost.performancePostId);
            const didLoggedInUserCreatePost =
              performancePost.userWhoCreatedPost?.steamUserId64 === userSession.steamUserId64;
            return (
              <div key={performancePost.performancePostId} id={performancePost.performancePostId.toString()} className="flex flex-col gap-6">
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
