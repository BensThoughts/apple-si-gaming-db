import { redirect, json } from '@remix-run/node';
import {
  isTypeFrameRateAverage,
  isTypeGamepadRating,
  isTypeRatingMedal,
  validateGamepadRating,
  validatePostFrameRateAverage,
  validatePostGamepadId,
  validatePostRatingMedal,
  validatePostTagIds,
  validatePostText,
  validateSystemSpecIdForPost,
} from '~/lib/form-validators/posts';
import { createPerformancePost } from '~/models/SteamedApples/performancePost.server';
import type { CreateOrEditPerformancePostActionData } from './create-or-edit-action-type';
import { extractFormData } from './extract-form-data';

export const badRequest = (data: CreateOrEditPerformancePostActionData) => json(data, { status: 400 });

export async function createPerformancePostAction({
  steamAppId,
  steamUserId64,
  formData,
} : {
  steamAppId: number;
  steamUserId64: string;
  formData: FormData;
}) {
  const {
    formError,
    fieldsRaw,
  } = extractFormData(formData);
  if (formError || !fieldsRaw) {
    return badRequest({ formError });
  }
  const {
    postText,
    ratingMedal,
    frameRateAverage,
    frameRateStutters,
    systemSpecId,
    postTagIds,
    gamepadId,
    gamepadRating,
  } = fieldsRaw;

  const fieldErrors = {
    postText: validatePostText(postText),
    ratingMedal: validatePostRatingMedal(ratingMedal),
    gamepadId: validatePostGamepadId(gamepadId, gamepadRating),
    gamepadRating: validateGamepadRating(gamepadRating, gamepadId),
    postTagIds: validatePostTagIds(postTagIds),
    frameRateAverage: validatePostFrameRateAverage(frameRateAverage),
    systemSpecId: validateSystemSpecIdForPost(systemSpecId),
  };
  const fields = {
    postText,
    // ratingMedal,
    // gamepadId,
    // gamepadRating,
    // postTagIds,
    // frameRateAverage,
    // frameRateStutters,
    // systemSpecId,
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  // Used for Typescript type validation, should never return true by this point
  if (!isTypeRatingMedal(ratingMedal)) {
    return { fieldErrors, fields };
  }
  // Used for Typescript type validation, should never return true by this point
  if (
    frameRateAverage !== 'None' &&
    !isTypeFrameRateAverage(frameRateAverage)
  ) {
    return { fieldErrors, fields };
  }
  // Used for Typescript type validation, should never return true by this point
  if (
    gamepadRating !== 'None' &&
    !isTypeGamepadRating(gamepadRating)
  ) {
    return { fieldErrors, fields };
  }

  await createPerformancePost({
    steamUserId64,
    steamAppId,
    postText,
    ratingMedal,
    frameRateAverage: frameRateAverage === 'None' ? undefined : frameRateAverage,
    frameRateStutters,
    systemSpecId: systemSpecId < 0 ? undefined : systemSpecId,
    postTagIds,
    gamepadId: gamepadId < 0 ? undefined : gamepadId,
    gamepadRating: gamepadRating === 'None' ? undefined : gamepadRating,
  });

  return redirect(`/apps/${steamAppId}/posts`);
}
