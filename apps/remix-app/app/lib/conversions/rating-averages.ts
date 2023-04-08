import type { FrameRateTierRank, GamepadTierRank, RatingTierRank } from '~/interfaces';
import {
  convertFrameRateTierRankToNumber,
  convertGamepadTierRankToNumber,
  convertNumberToFrameRateTierRank,
  convertNumberToGamepadTierRank,
  convertNumberToRatingTierRank,
  convertRatingTierRankToNumber,
} from '~/lib/conversions/rating-conversions';

const arrAvg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

export function getAverageRatingTierRank(
    ratingTierRanks: RatingTierRank[],
) {
  if (ratingTierRanks.length < 1) {
    return undefined;
  }
  const ratingTierRankNumbers =
    ratingTierRanks
        .map((ratingTierRank) => convertRatingTierRankToNumber(ratingTierRank));
  const avg = arrAvg(ratingTierRankNumbers);
  const avgInt = Math.round(avg);
  const tierRank = convertNumberToRatingTierRank(avgInt as 0 | 1 | 2 | 3 | 4 | 5 | 6);
  return tierRank;
}

export function getAverageFrameRateTierRank(
    frameRateTierRanks: FrameRateTierRank[],
) {
  const frameRateTierRankNumbers =
  frameRateTierRanks
      .map((frameRateTierRank) =>
        convertFrameRateTierRankToNumber(frameRateTierRank),
      );
  if (frameRateTierRankNumbers.length < 1) {
    return undefined;
  }
  const avg = arrAvg(frameRateTierRankNumbers);
  const avgInt = Math.round(avg);
  const tierRank = convertNumberToFrameRateTierRank(avgInt as 0 | 1 | 2 | 3 | 4 | 5);
  return tierRank;
}

export function getPercentPostsStutters(
    frameRateStuttersArr: boolean[],
) {
  const numPostsStutters =
    frameRateStuttersArr
        .filter((frameRateStutters) => frameRateStutters).length;
  const percentStutters = (numPostsStutters / frameRateStuttersArr.length) * 100;
  return Math.round(percentStutters);
}

export function getAverageGamepadTierRank(
    gamepadTierRanks: GamepadTierRank[],
) {
  const gamepadRatingNumbers =
    gamepadTierRanks
        .map((gamepadTierRank) =>
          convertGamepadTierRankToNumber(gamepadTierRank));
  if (gamepadRatingNumbers.length < 1) {
    return undefined;
  }
  const avg = arrAvg(gamepadRatingNumbers);
  const avgInt = Math.round(avg);
  const gamepadTierRank = convertNumberToGamepadTierRank(avgInt as 0 | 1 | 2 | 3 | 4);
  return gamepadTierRank;
}
