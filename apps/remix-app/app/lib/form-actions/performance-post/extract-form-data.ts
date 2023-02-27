import type {
  PerformancePostFormFieldsRaw,
} from './create-or-edit-action-type';

/**
  Converts performance post form data into usable data for creating or editing a
  post. Returns a bad request 400 if there is an error in the data
*/

export function extractFormData(formData: FormData): {
  formError?: string;
  fieldsRaw?: PerformancePostFormFieldsRaw;
} {
  const postText = formData.get('performancePostText');
  const frameRateAverage = formData.get('performancePostFrameRateAverage[value]');
  const frameRateStutters = formData.get('performancePostFrameRateStutters');
  const ratingMedal = formData.get('performancePostRatingMedal[value]');
  const systemSpecIdData = formData.get('performancePostSystemSpecId[value]');
  const postTagIdsData = formData.getAll('performancePostTags');
  const gamepadIdData = formData.get('performancePostGamepadId[value]');
  const gamepadRating = formData.get('performancePostGamepadRating[value]');

  if (
    typeof postText !== 'string' ||
    typeof frameRateAverage !== 'string' ||
    typeof ratingMedal !== 'string' ||
    typeof systemSpecIdData !== 'string' ||
    typeof gamepadIdData !== 'string' ||
    typeof gamepadRating !== 'string' ||
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
      frameRateAverage,
      frameRateStutters: frameRateStutters ? true : false,
      ratingMedal,
      systemSpecId,
      gamepadId,
      gamepadRating,
      postTagIds,
    },
  };
}
