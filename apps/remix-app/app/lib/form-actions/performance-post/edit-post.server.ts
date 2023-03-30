import { redirect, json } from '@remix-run/node';
import type { EditPerformancePostActionData } from './types';
import {
  validatePostText,
  isTypeFrameRateAverage,
  validatePostFrameRateAverage,
  isTypeRatingMedal,
  validatePostRatingMedal,
  validatePostTagIds,
  validatePostGamepadId,
  validateGamepadRating,
  isTypeGamepadRating,
  validateSystemSpecIdForPost,
} from '~/lib/form-validators/posts';
import { updatePerformancePost } from '~/models/SteamedApples/performancePost.server';
import { extractFormData } from './extract-form-data';
import { safeRedirect } from '~/lib/utils.server';


const badRequest = (data: EditPerformancePostActionData) => json(data, { status: 400 });

export async function editPerformancePostAction({
  steamAppId,
  performancePostId,
  formData,
  redirectToAfterEdit,
} : {
  steamAppId: number;
  performancePostId: number;
  formData: FormData;
  redirectToAfterEdit: string | null;
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
    postTags: validatePostTagIds(postTagIds),
    frameRateAverage: validatePostFrameRateAverage(frameRateAverage),
    systemSpecId: validateSystemSpecIdForPost(systemSpecId),
    // systemName: validateSystemName(systemName),
  };
  const fields = {
    postText,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  // This should never return true (used for Typescript type validation)
  if (
    frameRateAverage !== 'None' &&
    !isTypeFrameRateAverage(frameRateAverage)
  ) {
    return badRequest({ fieldErrors, fields });
  }

  // This should never return true (used for Typescript type validation)
  if (!isTypeRatingMedal(ratingMedal)) {
    return badRequest({ fieldErrors, fields });
  }

  // This should never return true (used for Typescript type validation)
  if (
    gamepadRating !== 'None' &&
    !isTypeGamepadRating(gamepadRating)
  ) {
    return badRequest({ fieldErrors, fields });
  }

  await updatePerformancePost({
    performancePostId,
    postText,
    frameRateAverage: frameRateAverage === 'None' ? undefined : frameRateAverage,
    frameRateStutters,
    ratingMedal,
    systemSpecId: systemSpecId < 0 ? undefined : systemSpecId,
    postTagIds,
    gamepadId: gamepadId < 0 ? undefined : gamepadId,
    gamepadRating: gamepadRating === 'None' ? undefined : gamepadRating,
  });

  const redirectTo = redirectToAfterEdit
    ? safeRedirect(redirectToAfterEdit)
    : `/apps/${steamAppId}/posts`;

  return redirect(redirectTo);
}
