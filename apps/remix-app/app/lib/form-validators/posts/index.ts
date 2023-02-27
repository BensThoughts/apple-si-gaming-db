import type { FrameRate, GamepadRating, RatingMedal } from '~/interfaces';


export function isTypeFrameRateAverage(frameRateAverage: string): frameRateAverage is FrameRate {
  return ['VeryLow', 'Low', 'Medium', 'High', 'VeryHigh'].includes(frameRateAverage);
}

export function validatePostFrameRateAverage(frameRateAverageValue: string) {
  if (
    frameRateAverageValue.toLowerCase() !== 'none' &&
    !isTypeFrameRateAverage(frameRateAverageValue)
  ) {
    return `${frameRateAverageValue} is not a valid frame rate option`;
  }
}

export function isTypeRatingMedal(ratingMedal: string): ratingMedal is RatingMedal {
  return ['Borked', 'Bronze', 'Silver', 'Gold', 'Platinum'].includes(ratingMedal);
}

export function validatePostRatingMedal(ratingMedal: string) {
  if (ratingMedal.toLowerCase() === 'none') {
    return `rating cannot be none`;
  }
  if (!isTypeRatingMedal(ratingMedal)) {
    return `${ratingMedal} is not a valid option`;
  }
}

export function validatePostText(postText: string) {
  if (postText.length < 3) {
    return `performance posts text is too short (3 character minimum)`;
  }
  if (postText.length > 1500) {
    return `performance posts text is too long (1500 character maximum)`;
  }
}

export function validatePostTagIds(postTagIds: number[]) {
  let invalidTag: number | undefined = undefined;
  if (postTagIds.some((tagId) => {
    if (
      !isFinite(tagId) ||
      tagId < 0
    ) {
      invalidTag = tagId;
      return true;
    }
    return false;
  })) {
    return `${invalidTag} is not a valid tagId`;
  }
}

export function isTypeGamepadRating(ratingMedal: string): ratingMedal is GamepadRating {
  return ['GamepadBorked', 'GamepadBronze', 'GamepadSilver', 'GamepadGold', 'GamepadPlatinum'].includes(ratingMedal);
}

export function validatePostGamepadId(gamepadId: number, gamepadRating: string) {
  if (!isFinite(gamepadId)) {
    return 'gamepad ID was not a valid number';
  }
  if (gamepadId < -1) {
    return 'gamepad ID was not a positive number';
  }
  // The None Case for gamepadId is value 0
  // By this point we know gamepadId is a valid >= 0 number
  if (
    gamepadId === -1 &&
    isTypeGamepadRating(gamepadRating)
  ) {
    return `controller rating given with no controller selected`;
  }
}

export function validateGamepadRating(gamepadRating: string, gamepadId: number) {
  // The None Case for gamepadId is value 0
  if (gamepadId !== -1) {
    if (gamepadRating.toLowerCase() === 'none') {
      return `rating cannot be none when controller is selected`;
    }
    if (!isTypeGamepadRating(gamepadRating)) {
      return `rating was not a valid rating option`;
    }
  }
}


// TODO: duplicate code between profile and post
export function validateSystemSpecIdForPost(systemSpecId: number) {
  if (!isFinite(systemSpecId)) {
    return `The systemId ${systemSpecId} was not a valid number`;
  }
  if (systemSpecId < -1) {
    return `The systemId ${systemSpecId} was not a positive number`;
  }
}
