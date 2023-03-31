import AppRatingOverview from './AppRatingOverview';
import PerformancePostDisplay from './PerformancePostDisplay';
import type {
  PerformancePost,
} from '~/interfaces';
import PostLayoutCard from './PerformancePostLayoutCard';

type PerformancePostLayoutProps = {
  performancePosts: PerformancePost[];
}


export default function PerformancePostLayout({
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
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <AppRatingOverview performancePostRatings={performancePosts.map((post) => post.rating)} />
      <PostLayoutCard>
        <div className="flex flex-col gap-6 w-full">
          {performancePosts.map(({
            performancePostId,
            ...rest
          }, idx) => {
            return (
              <div
                key={performancePostId}
                id={performancePostId.toString()}
                className="flex flex-col gap-6"
              >
                <PerformancePostDisplay
                  performancePost={{ performancePostId, ...rest }}
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
