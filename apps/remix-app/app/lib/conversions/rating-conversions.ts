import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
  TierRank,
} from '~/interfaces';

export function convertTierRankToName(tierRank: TierRank) {
  switch (tierRank) {
    case 'STier':
      return 'S Tier';
    case 'ATier':
      return 'A Tier';
    case 'BTier':
      return 'B Tier';
    case 'CTier':
      return 'C Tier';
    case 'DTier':
      return 'D Tier';
    case 'ETier':
      return 'E Tier';
    case 'FTier':
      return 'F Tier';
    default:
      throw new Error(`${tierRank} was not a valid tier rank`);
  }
}

export function convertRatingTierRankToDescription(ratingTierRank: RatingTierRank) {
  switch (ratingTierRank) {
    case 'STier':
      return 'Runs [ perfect ]';
    case 'ATier':
      return 'Runs [ perfect after tweaks ]';
    case 'BTier':
      return 'Runs [ with minor issues ]';
    case 'CTier':
      return 'Runs [ with major issues ]';
    case 'DTier':
      return 'Runs [ crashes sometimes ]';
    case 'ETier':
      return 'Runs [ crashes often ]';
    case 'FTier':
      return `Doesn't Run`;
    default:
      throw new Error(`${ratingTierRank} was not a valid rating tier rank`);
  }
}

export function convertRatingTierRankToFullText(ratingTierRank: RatingTierRank) {
  return `${convertTierRankToName(ratingTierRank)} - ${convertRatingTierRankToDescription(ratingTierRank)} `;
}

export function convertFrameRateTierRankToDescription(frameRateTierRank: FrameRateTierRank) {
  switch (frameRateTierRank) {
    case 'STier':
      return '120+ FPS';
    case 'ATier':
      return '60 - 120 FPS';
    case 'BTier':
      return '45 - 60 FPS';
    case 'CTier':
      return '30 - 45 FPS';
    case 'DTier':
      return '15 - 30 FPS';
    case 'FTier':
      return '0 - 15 FPS';
    default:
      throw new Error(`${frameRateTierRank} was not a valid frame rate tier rank`);
  }
}

// export function convertFrameRateTierRankToFullText(frameRateTierRank: FrameRateTierRank) {
//   return `${convertTierRankToName(frameRateTierRank)} - ${convertFrameRateTierRankToDescription(frameRateTierRank)} `;
// }

export function convertGamepadTierRankToDescription(gamepadTierRank: GamepadTierRank) {
  switch (gamepadTierRank) {
    case 'STier':
      return `Works perfect`;
    case 'ATier':
      return `Works perfect after tweaks`;
    case 'BTier':
      return `Works with minor issues`;
    case 'CTier':
      return `Works with major issues`;
    case 'FTier':
      return `Doesn't work`;
    default:
      throw new Error(`${gamepadTierRank} was not a valid gamepad tier rank`);
  }
}

export function convertGamepadTierRankToFullText(gamepadTierRank: GamepadTierRank) {
  return `${convertTierRankToName(gamepadTierRank)} - ${convertGamepadTierRankToDescription(gamepadTierRank)} `;
}

export function convertRatingTierRankToNumber(ratingTierRank: RatingTierRank) {
  switch (ratingTierRank) {
    case 'STier':
      return 6;
    case 'ATier':
      return 5;
    case 'BTier':
      return 4;
    case 'CTier':
      return 3;
    case 'DTier':
      return 2;
    case 'ETier':
      return 1;
    case 'FTier':
      return 0;
    default:
      throw new Error(`${ratingTierRank} was not a valid rating tier rank`);
  }
}

export function convertNumberToRatingTierRank(
    ratingTierRankNumber: 0 | 1 | 2 | 3 | 4 | 5 | 6,
): RatingTierRank {
  switch (ratingTierRankNumber) {
    case 6:
      return 'STier';
    case 5:
      return 'ATier';
    case 4:
      return 'BTier';
    case 3:
      return 'CTier';
    case 2:
      return 'DTier';
    case 1:
      return 'ETier';
    case 0:
      return 'FTier';
    default:
      throw new Error(`${ratingTierRankNumber} was not a valid rating tier rank number, valid numbers are 0 - 6`);
  }
}

export function convertFrameRateTierRankToNumber(frameRateTierRank: FrameRateTierRank) {
  switch (frameRateTierRank) {
    case 'STier':
      return 5;
    case 'ATier':
      return 4;
    case 'BTier':
      return 3;
    case 'CTier':
      return 2;
    case 'DTier':
      return 1;
    case 'FTier':
      return 0;
    default:
      throw new Error(`${frameRateTierRank} was not a valid frame rate tier rank`);
  }
}

export function convertNumberToFrameRateTierRank(
    frameRateTierNumber: 0 | 1 | 2 | 3 | 4 | 5,
): FrameRateTierRank {
  switch (frameRateTierNumber) {
    case 5:
      return 'STier';
    case 4:
      return 'ATier';
    case 3:
      return 'BTier';
    case 2:
      return 'CTier';
    case 1:
      return 'DTier';
    case 0:
      return 'FTier';
    default:
      throw new Error(`${frameRateTierNumber} was not a valid rating tier rank number, valid numbers are 0 - 5`);
  }
}

export function convertGamepadTierRankToNumber(gamepadTierRank: GamepadTierRank) {
  switch (gamepadTierRank) {
    case 'STier':
      return 4;
    case 'ATier':
      return 3;
    case 'BTier':
      return 2;
    case 'CTier':
      return 1;
    case 'FTier':
      return 0;
    default:
      throw new Error(`${gamepadTierRank} was not a valid frame rate tier rank`);
  }
}

export function convertNumberToGamepadTierRank(
    gamepadTierRankNumber: 0 | 1 | 2 | 3 | 4,
): GamepadTierRank {
  switch (gamepadTierRankNumber) {
    case 4:
      return 'STier';
    case 3:
      return 'ATier';
    case 2:
      return 'BTier';
    case 1:
      return 'CTier';
    case 0:
      return 'FTier';
    default:
      throw new Error(`${gamepadTierRankNumber} was not a valid rating tier rank number, valid numbers are 0 - 4`);
  }
}
