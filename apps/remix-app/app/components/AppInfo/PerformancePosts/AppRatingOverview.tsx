import type { GamepadRating, RatingMedal, FrameRate } from '~/interfaces';
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
} from '~/lib/rating-conversions';

interface PerformancePostData {
  id: string;
  postText: string;
  postTags: {
    postTagId: number;
    description: string;
  }[],
  gamepadMetadata: {
    gamepadId: number;
    description: string;
  } | null,
  gamepadRating: GamepadRating | null;
  createdAt: Date;
  ratingMedal: RatingMedal;
  frameRateAverage?: FrameRate | null;
  frameRateStutters?: boolean | null;
  displayName?: string | null;
  avatarMedium?: string | null;
  systemManufacturer?: string | null;
  systemModel?: string | null;
  systemOsVersion?: string | null;
  systemCpuBrand?: string | null;
  systemVideoDriver?: string | null;
  systemVideoDriverVersion?: string | null;
  systemVideoPrimaryVRAM?: string | null;
  systemMemoryRAM?: string | null;
}

interface AppRatingOverviewProps {
  performancePosts: PerformancePostData[];
}

const arrAvg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

function getAverageMedalRating(perfPosts: PerformancePostData[]) {
  const medalRatingNumbers = perfPosts.map((perfPost) => convertRatingMedalToNumber(perfPost.ratingMedal));
  const avg = arrAvg(medalRatingNumbers);
  const avgInt = Math.round(avg);
  const medal = convertNumberToRatingMedal(avgInt as 0 | 1 | 2 | 3 | 4);
  return medal;
}

function getAverageFrameRate(perfPosts: PerformancePostData[]) {
  const frameRateNumbers =
    perfPosts
        .map((perfPost) => perfPost.frameRateAverage)
        .filter((frameRateAverage) => isTypeFrameRateAverage(frameRateAverage as string))
        .map((frameRate) => convertFrameRateToNumber(frameRate as FrameRate));
  const avg = arrAvg(frameRateNumbers);
  const avgInt = Math.round(avg);
  const frameRate = convertNumberToFrameRate(avgInt as 0 | 1 | 2 | 3 | 4);
  return frameRate;
}

function getPercentPostsStutters(perfPosts: PerformancePostData[]) {
  const numPostsStutters = perfPosts.filter((perfPost) => perfPost.frameRateStutters).length;
  const percentStutters = (numPostsStutters / perfPosts.length) * 100;
  return Math.round(percentStutters);
}

function getAverageGamepadRating(perfPosts: PerformancePostData[]) {
  const gamepadRatingNumbers =
    perfPosts
        .filter((perfPost) => isTypeGamepadRating(perfPost.gamepadRating as string))
        .map((perfPost) => convertGamepadRatingToNumber(perfPost.gamepadRating as GamepadRating));
  const avg = arrAvg(gamepadRatingNumbers);
  const avgInt = Math.round(avg);
  const gamepadRating = convertNumberToGamepadRating(avgInt as 0 | 1 | 2 | 3 | 4);
  return gamepadRating;
}

export default function AppRatingOverview({ performancePosts }: AppRatingOverviewProps) {
  const avgMedalInt = getAverageMedalRating(performancePosts);
  const avgFrameRate = getAverageFrameRate(performancePosts);
  const percentStutters = getPercentPostsStutters(performancePosts);
  const avgGamepadRating = getAverageGamepadRating(performancePosts);
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
