import type {
  PerformancePostFormFieldsRaw,
} from './types';

import {
  FieldNames,
} from './types';

/**
  Converts performance post form data into usable data for creating or editing a
  post. Returns a bad request 400 if there is an error in the data
*/

export function extractFormData(formData: FormData): {
  formError?: string;
  fieldsRaw?: PerformancePostFormFieldsRaw;
} {
  const postText = formData.get(FieldNames.PostText);
  const frameRateTierRank = formData.get(FieldNames.FrameRateTierRank + '[value]');
  const frameRateStutters = formData.get(FieldNames.FrameRateStutters);
  const ratingTierRank = formData.get(FieldNames.RatingTierRank + '[value]');
  const systemSpecIdData = formData.get(FieldNames.SystemSpecId + '[value]');
  const postTagIdsData = formData.getAll(FieldNames.PostTagIds);
  const gamepadIdData = formData.get(FieldNames.GamepadId + '[value]');
  const gamepadTierRank = formData.get(FieldNames.GamepadTierRank + '[value]');

  if (
    typeof postText !== 'string' ||
    typeof frameRateTierRank !== 'string' ||
    typeof ratingTierRank !== 'string' ||
    typeof systemSpecIdData !== 'string' ||
    typeof gamepadIdData !== 'string' ||
    typeof gamepadTierRank !== 'string' ||
    postTagIdsData.some((tagId) => typeof tagId !== 'string')
  ) {
    return {
      formError: `Form not submitted correctly.`,
    };
  }

  const postTagIds: number[] =
  postTagIdsData[0] === ''
    ? []
    : postTagIdsData.map((tagId) => Number(tagId.toString()));
  const gamepadId = Number(gamepadIdData);
  const systemSpecId = Number(systemSpecIdData);

  return {
    fieldsRaw: {
      postText,
      frameRateTierRank,
      frameRateStutters: frameRateStutters ? true : false,
      ratingTierRank,
      systemSpecId,
      gamepadId,
      gamepadTierRank,
      postTagIds,
    },
  };
}
