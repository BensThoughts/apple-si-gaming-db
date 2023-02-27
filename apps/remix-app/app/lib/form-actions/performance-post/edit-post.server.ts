import { redirect, json } from '@remix-run/node';
import type { CreateOrEditPerformancePostActionData } from '~/lib/form-actions/performance-post/create-or-edit-action-type';
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


const badRequest = (data: CreateOrEditPerformancePostActionData) => json(data, { status: 400 });

export async function editPerformancePostAction({
  steamUserId64,
  steamAppId,
  performancePostId,
  formData,
} : {
  steamUserId64: string;
  steamAppId: number;
  performancePostId: string;
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
    steamUserId64,
    performancePostId,
    postText,
    frameRateAverage: frameRateAverage === 'None' ? undefined : frameRateAverage,
    frameRateStutters,
    ratingMedal,
    systemSpecId,
    postTagIds,
    gamepadId,
    gamepadRating: gamepadRating === 'None' ? undefined : gamepadRating,
  });

  return redirect(`/apps/${steamAppId}/performance-posts`);
}
