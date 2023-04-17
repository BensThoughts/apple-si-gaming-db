import type {
  PerformancePostFormFieldsRaw,
} from './types';

import {
  PerformancePostFieldNames,
} from '~/lib/enums/FormFields/PerformancePost';

/**
  Converts performance post form data into usable data for creating or editing a
  post. Returns a bad request 400 if there is an error in the data
*/

export function extractFormData(formData: FormData): {
  formError?: string;
  fieldsRaw?: PerformancePostFormFieldsRaw;
} {
  const postText = formData.get(PerformancePostFieldNames.PostText);
  // const postHTML = formData.get(PerformancePostFieldNames.PostHTML);
  const frameRateTierRank = formData.get(PerformancePostFieldNames.FrameRateTierRank + '[value]');
  const frameRateStutters = formData.get(PerformancePostFieldNames.FrameRateStutters);
  const ratingTierRank = formData.get(PerformancePostFieldNames.RatingTierRank + '[value]');
  const systemSpecIdData = formData.get(PerformancePostFieldNames.SystemSpecId + '[value]');
  const postTagIdsData = formData.getAll(PerformancePostFieldNames.PostTagIds);
  const gamepadIdData = formData.get(PerformancePostFieldNames.GamepadId + '[value]');
  const gamepadTierRank = formData.get(PerformancePostFieldNames.GamepadTierRank + '[value]');

  if (
    typeof postText !== 'string' ||
    // typeof postHTML !== 'string' ||
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
      // postHTML,
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
