import type { GamepadRating, FrameRate } from '~/interfaces';
import { isTypeFrameRateAverage, isTypeGamepadRating } from '~/lib/form-validators/posts';
import {
  convertRatingMedalToNumber,
  convertNumberToRatingMedal,
  convertFrameRateToNumber,
  convertNumberToFrameRate,
  convertFrameRateToDescription,
  convertGamepadRatingToNumber,
  convertNumberToGamepadRating,
  convertGamepadRatingToMedalText,
} from '~/lib/conversions/rating-conversions';
import type { PerformancePostRating } from '~/interfaces';

interface AppRatingOverviewProps {
  performancePostRatings: PerformancePostRating[];
}

const arrAvg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

function getAverageMedalRating(perfPostRatings: PerformancePostRating[]) {
  const medalRatingNumbers =
    perfPostRatings
        .map((perfPostRating) => convertRatingMedalToNumber(perfPostRating.ratingMedal));
  const avg = arrAvg(medalRatingNumbers);
  const avgInt = Math.round(avg);
  const medal = convertNumberToRatingMedal(avgInt as 0 | 1 | 2 | 3 | 4);
  return medal;
}

function getAverageFrameRate(perfPostRatings: PerformancePostRating[]) {
  const frameRateNumbers =
    perfPostRatings
        .map((perfPostRating) => perfPostRating.frameRateAverage)
        .filter((frameRateAverage) => isTypeFrameRateAverage(frameRateAverage as string))
        .map((frameRate) => convertFrameRateToNumber(frameRate as FrameRate));
  const avg = arrAvg(frameRateNumbers);
  const avgInt = Math.round(avg);
  const frameRate = convertNumberToFrameRate(avgInt as 0 | 1 | 2 | 3 | 4);
  return frameRate;
}

function getPercentPostsStutters(perfPostRatings: PerformancePostRating[]) {
  const numPostsStutters =
    perfPostRatings
        .filter((perfPostRating) => perfPostRating.frameRateStutters).length;
  const percentStutters = (numPostsStutters / perfPostRatings.length) * 100;
  return Math.round(percentStutters);
}

function getAverageGamepadRating(perfPostRatings: PerformancePostRating[]) {
  const gamepadRatingNumbers =
    perfPostRatings
        .filter((perfPostRating) => isTypeGamepadRating(perfPostRating.gamepadRating as string))
        .map((perfPostRating) => convertGamepadRatingToNumber(perfPostRating.gamepadRating as GamepadRating));
  const avg = arrAvg(gamepadRatingNumbers);
  const avgInt = Math.round(avg);
  const gamepadRating = convertNumberToGamepadRating(avgInt as 0 | 1 | 2 | 3 | 4);
  return gamepadRating;
}

export default function AppRatingOverview({ performancePostRatings }: AppRatingOverviewProps) {
  const avgMedalInt = getAverageMedalRating(performancePostRatings);
  const avgFrameRate = getAverageFrameRate(performancePostRatings);
  const percentStutters = getPercentPostsStutters(performancePostRatings);
  const avgGamepadRating = getAverageGamepadRating(performancePostRatings);
  return (
    <div className="flex flex-col items-center gap-2 w-full bg-tertiary border-solid
                    border-2 border-secondary p-3 rounded-lg text-primary-highlight">
      <div className="text-center">
        <h2 className="text-xl text-secondary">Apple Compatibility Score</h2>
      </div>
      <div className="flex gap-1 md:gap-2">
        <div>
          {`[ `}
          {avgMedalInt}
          {` ] `}
        </div>
        <span className="text-primary-faded">Overall Medal Rating</span>
      </div>
      <div className="flex gap-1 md:gap-2">
        <div>
          {`[ `}
          {avgFrameRate ? convertFrameRateToDescription(avgFrameRate) : 'None Given Yet'}
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
          {avgGamepadRating ? convertGamepadRatingToMedalText(avgGamepadRating) : 'None Given Yet'}
          {` ] `}
        </div>
        <span className="text-primary-faded">Average Controller Rating</span>
      </div>
    </div>
  );
}
