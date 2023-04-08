import PerformancePostDisplay from './Display/PerformancePostDisplay';
import type {
  PerformancePost,
} from '~/interfaces';
import PostLayoutCard from './PerformancePostLayoutCard';
import { Fragment } from 'react';

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
    // <PostLayoutCard>
    <div className="flex flex-col gap-6 w-full">
      {performancePosts.map(({
        performancePostId,
        ...rest
      }, idx) => {
        return (
          <Fragment
            key={performancePostId}
          >
            <PerformancePostDisplay
              performancePost={{ performancePostId, ...rest }}
            />
            {/* {(performancePosts.length - 1 > idx) &&
                <hr className="text-secondary" />
              } */}
          </Fragment>
        );
      })}
    </div>
    // </PostLayoutCard>
  );
}
