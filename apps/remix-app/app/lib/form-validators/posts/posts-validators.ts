import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
} from '~/types/remix-app';


export function isTypeFrameRateTierRank(
    frameRateTierRank?: string | null,
): frameRateTierRank is FrameRateTierRank {
  if (frameRateTierRank != null && frameRateTierRank != undefined) {
    return [
      'STier',
      'ATier',
      'BTier',
      'CTier',
      'DTier',
      'FTier',
    ].includes(frameRateTierRank);
  }
  return false;
}

export function validatePostFrameRateTierRank(frameRateTierRank: string) {
  if (
    frameRateTierRank.toLowerCase() !== 'none' &&
    !isTypeFrameRateTierRank(frameRateTierRank)
  ) {
    return `${frameRateTierRank} is not a valid frame rate option`;
  }
}

export function isTypeRatingTierRank(
    ratingTierRank?: string | null,
): ratingTierRank is RatingTierRank {
  if (ratingTierRank != null && ratingTierRank != undefined) {
    return [
      'STier',
      'ATier',
      'BTier',
      'CTier',
      'DTier',
      'ETier',
      'FTier',
    ].includes(ratingTierRank);
  }
  return false;
}

export function validatePostRatingTierRank(ratingTierRank: string) {
  if (ratingTierRank.toLowerCase() === 'none') {
    return `tier rank cannot be none`;
  }
  if (!isTypeRatingTierRank(ratingTierRank)) {
    return `${ratingTierRank} is not a valid tier rank option`;
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
    return `${invalidTag} is not a valid tagId for post tags`;
  }
}

export function isTypeGamepadTierRank(
    gamepadTierRank?: string | null,
): gamepadTierRank is GamepadTierRank {
  if (gamepadTierRank != null && gamepadTierRank != undefined) {
    return [
      'STier',
      'ATier',
      'BTier',
      'CTier',
      'FTier',
    ].includes(gamepadTierRank);
  }
  return false;
}

export function validatePostGamepadId(gamepadId: number, gamepadTierRank: string) {
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
    isTypeGamepadTierRank(gamepadTierRank)
  ) {
    return `gamepad tier rank given with no gamepad selected`;
  }
}

export function validateGamepadTierRank(gamepadTierRank: string, gamepadId: number) {
  // The None Case for gamepadId is value 0
  if (gamepadId !== -1) {
    if (gamepadTierRank.toLowerCase() === 'none') {
      return `gamepad tier rank cannot be none when a gamepad is selected`;
    }
    if (!isTypeGamepadTierRank(gamepadTierRank)) {
      return `gamepad tier rank was not a valid rating option`;
    }
  }
}


// TODO: duplicate code between profile and post
export function validateSystemSpecIdForPost(systemSpecId: number) {
  if (!isFinite(systemSpecId)) {
    return `the systemId ${systemSpecId} was not a valid number`;
  }
  if (systemSpecId < -1) {
    return `the systemId ${systemSpecId} was not a positive number`;
  }
}
