import PerformancePostCard from '~/components/PerformancePostCards/PerformancePostCard';
import type {
  PerformancePost,
} from '~/types';
import { Fragment } from 'react';

type PerformancePostLayoutProps = {
  performancePosts: PerformancePost[];
}


export default function PerformancePostLayout({
  performancePosts,
}: PerformancePostLayoutProps) {
  if (performancePosts.length < 1) {
    return (
      <div className="w-full flex items-center justify-center bg-tertiary px-4 py-5 rounded-lg">
        There are currently no performance posts for this app. Use the form below to
        <strong className="font-semibold text-primary-highlight">
          {` `}become the first to submit!
        </strong>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {performancePosts.map(({
        performancePostId,
        ...rest
      }, idx) => {
        return (
          <Fragment
            key={performancePostId}
          >
            <PerformancePostCard
              performancePost={{ performancePostId, ...rest }}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
