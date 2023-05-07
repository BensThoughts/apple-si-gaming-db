import type { AveragePerformancePostRating } from '~/types/remix-app';
import {
  convertFrameRateTierRankToDescription,
  convertGamepadTierRankToDescription,
  convertRatingTierRankToDescription,
} from '~/lib/conversions/rating-conversions';
import TierRankBadge from '~/components/TierRankBadge';
import TextPill from '~/components/TextPill';

interface AppRatingOverviewProps {
  avgPerformancePostRating: AveragePerformancePostRating;
}

export default function AppRatingOverview({
  avgPerformancePostRating: {
    avgRatingTierRank,
    avgFrameRateTierRank,
    percentPostsWhereFrameRateStutters,
    frameRateStuttersTierRank,
    avgGamepadTierRank,
  },
}: AppRatingOverviewProps) {
  return (
    <div className="flex flex-col items-center gap-4 bg-tertiary min-w-fit
                    px-3 pt-3 pb-4 rounded-lg w-full">
      <div className="text-center">
        <h2 className="text-xl text-secondary">Apple Compatibility Score</h2>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-start gap-1 min-w-fit">
          <span className="text-primary text-sm">Average Tier Rank</span>
          {avgRatingTierRank ? (
            <TierRankBadge tierRank={avgRatingTierRank}>
              {convertRatingTierRankToDescription(avgRatingTierRank)}
            </TierRankBadge>
          ) : (
            <TextPill>{`[ None Given ]`}</TextPill>
          )}
        </div>
        <div className="flex flex-col items-start gap-1 min-w-fit">
          <span className="text-primary text-sm">Average Frame Rate</span>
          {avgFrameRateTierRank ? (
          <TierRankBadge tierRank={avgFrameRateTierRank}>
            {convertFrameRateTierRankToDescription(avgFrameRateTierRank)}
          </TierRankBadge>
        ) : (
          <TextPill>{`[ None Given ]`}</TextPill>
        )}
        </div>
        <div className="flex flex-col items-start gap-1 min-w-fit">
          <span className="text-primary text-sm">Posts With Frame Rate Stutters</span>
          {avgRatingTierRank ? (
            <TierRankBadge tierRank={frameRateStuttersTierRank}>
              {`${percentPostsWhereFrameRateStutters}%`}
            </TierRankBadge>
          ) : (
            <TextPill>{`[ None Given ]`}</TextPill>
          )}
        </div>
        <div className="flex flex-col items-start gap-1 min-w-fit">
          <span className="text-primary text-sm">Average Gamepad Rank</span>
          {avgGamepadTierRank ? (
          <TierRankBadge tierRank={avgGamepadTierRank}>
            {convertGamepadTierRankToDescription(avgGamepadTierRank)}
          </TierRankBadge>
        ) : (
          <TextPill>{`[ None Given ]`}</TextPill>
        )}
        </div>
      </div>
    </div>
  );
}
