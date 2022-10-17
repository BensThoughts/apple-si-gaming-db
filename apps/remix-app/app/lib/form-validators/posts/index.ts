import type { FrameRate, RatingMedal } from '~/interfaces/database';


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
  return ['Borked', 'Bronze', 'Gold', 'Platinum', 'Silver'].includes(ratingMedal);
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
    return `The performance posts text is too short (3 character minimum)`;
  }
  if (postText.length > 1500) {
    return `The performance posts text is too long (1500 character maximum)`;
  }
}

export function validatePostTagIds(postTagIds: string[]) {
  let invalidTag: string | undefined = undefined;
  if (postTagIds.some((tagId) => {
    if (
      !isFinite(Number(tagId)) ||
      Number(tagId) < 0
    ) {
      invalidTag = tagId;
      return true;
    }
    return false;
  })) {
    return `${invalidTag} is not a valid tagId`;
  }
}
