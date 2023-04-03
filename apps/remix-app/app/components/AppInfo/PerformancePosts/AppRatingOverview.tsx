import type { GamepadTierRank, FrameRateTierRank } from '~/interfaces';
import { isTypeFrameRateTierRank, isTypeGamepadTierRank } from '~/lib/form-validators/posts';
import {
  convertRatingTierRankToNumber,
  convertNumberToRatingTierRank,
  convertFrameRateTierRankToNumber,
  convertNumberToFrameRateTierRank,
  convertFrameRateTierRankToDescription,
  convertGamepadTierRankToNumber,
  convertNumberToGamepadTierRank,
  convertTierRankToName,
} from '~/lib/conversions/rating-conversions';
import type { PerformancePost } from '~/interfaces';

type PerformancePostRating = PerformancePost['rating'];

interface AppRatingOverviewProps {
  performancePostRatings: PerformancePostRating[];
}

const arrAvg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

function getAverageRatingTierRank(performancePostRatings: PerformancePostRating[]) {
  const ratingTierRankNumbers =
    performancePostRatings
        .map((rating) => convertRatingTierRankToNumber(rating.ratingTierRank));
  const avg = arrAvg(ratingTierRankNumbers);
  const avgInt = Math.round(avg);
  const tierRank = convertNumberToRatingTierRank(avgInt as 0 | 1 | 2 | 3 | 4 | 5 | 6);
  return tierRank;
}

function getAverageFrameRateTierRank(performancePostRatings: PerformancePostRating[]) {
  const frameRateNumbers =
    performancePostRatings
        .map((rating) => rating.frameRateTierRank)
        .filter((frameRateTierRank) => isTypeFrameRateTierRank(frameRateTierRank))
        .map((frameRateTierRank) =>
          convertFrameRateTierRankToNumber(frameRateTierRank as FrameRateTierRank),
        );
  if (frameRateNumbers.length < 1) {
    return undefined;
  }
  const avg = arrAvg(frameRateNumbers);
  const avgInt = Math.round(avg);
  const tierRank = convertNumberToFrameRateTierRank(avgInt as 0 | 1 | 2 | 3 | 4 | 5);
  return tierRank;
}

function getPercentPostsStutters(perfPostRatings: PerformancePostRating[]) {
  const numPostsStutters =
    perfPostRatings
        .filter((rating) => rating.frameRateStutters).length;
  const percentStutters = (numPostsStutters / perfPostRatings.length) * 100;
  return Math.round(percentStutters);
}

function getAverageGamepadTierRank(perfPostRatings: PerformancePostRating[]) {
  const gamepadRatingNumbers =
    perfPostRatings
        .map((rating) => rating.gamepadTierRank)
        .filter((gamepadTierRank) => isTypeGamepadTierRank(gamepadTierRank))
        .map((gamepadTierRank) =>
          convertGamepadTierRankToNumber(gamepadTierRank as GamepadTierRank));
  if (gamepadRatingNumbers.length < 1) {
    return undefined;
  }
  const avg = arrAvg(gamepadRatingNumbers);
  const avgInt = Math.round(avg);
  const gamepadTierRank = convertNumberToGamepadTierRank(avgInt as 0 | 1 | 2 | 3 | 4);
  return gamepadTierRank;
}

export default function AppRatingOverview({ performancePostRatings }: AppRatingOverviewProps) {
  const avgRatingTierRank = getAverageRatingTierRank(performancePostRatings);
  const avgFrameRateTierRank = getAverageFrameRateTierRank(performancePostRatings);
  const percentStutters = getPercentPostsStutters(performancePostRatings);
  const avgGamepadTierRank = getAverageGamepadTierRank(performancePostRatings);
  return (
    <div className="flex flex-col items-center gap-2 w-full bg-tertiary
                    p-3 rounded-lg text-primary-highlight">
      <div className="text-center">
        <h2 className="text-xl text-secondary">Apple Compatibility Score</h2>
      </div>
      <div className="flex gap-1 md:gap-2">
        <div>
          {`[ `}
          {convertTierRankToName(avgRatingTierRank)}
          {` ] `}
        </div>
        <span className="text-primary-faded">Overall Rating</span>
      </div>
      <div className="flex gap-1 md:gap-2">
        <div>
          {`[ `}
          {avgFrameRateTierRank ? convertFrameRateTierRankToDescription(avgFrameRateTierRank) : 'None Given'}
          {` ] `}
        </div>
        <span className="text-primary-faded"> Average Frame Rate</span>
      </div>
      <div className="flex gap-1 md:gap-2">
        <div className="w-fit whitespace-nowrap">
          <span>
            {`[ `}
            {percentStutters}{`%`}
            {` ]`}
          </span>
        </div>
        <div>
          <span className="text-primary-faded">Posts Where Frame Rate Stutters</span>
        </div>
      </div>
      <div className="flex gap-1 md:gap-2">
        <div>
          {`[ `}
          {avgGamepadTierRank ? convertTierRankToName(avgGamepadTierRank) : 'None Given'}
          {` ] `}
        </div>
        <span className="text-primary-faded">Average Controller Rating</span>
      </div>
    </div>
  );
}
