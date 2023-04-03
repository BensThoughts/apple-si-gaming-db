import { redirect, json } from '@remix-run/node';
import {
  isTypeFrameRateTierRank,
  isTypeGamepadTierRank,
  isTypeRatingTierRank,
  validateGamepadTierRank,
  validatePostFrameRateTierRank,
  validatePostGamepadId,
  validatePostRatingTierRank,
  validatePostTagIds,
  validatePostText,
  validateSystemSpecIdForPost,
} from '~/lib/form-validators/posts';
import { createPerformancePost } from '~/models/SteamedApples/performancePost.server';
import type { CreatePerformancePostActionData } from './types';
import { extractFormData } from './extract-form-data';

export const badRequest = (data: CreatePerformancePostActionData) => json(data, { status: 400 });

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
    ratingTierRank,
    frameRateTierRank,
    frameRateStutters,
    systemSpecId,
    postTagIds,
    gamepadId,
    gamepadTierRank,
  } = fieldsRaw;

  const fieldErrors = {
    postText: validatePostText(postText),
    ratingTierRank: validatePostRatingTierRank(ratingTierRank),
    gamepadId: validatePostGamepadId(gamepadId, gamepadTierRank),
    gamepadTierRank: validateGamepadTierRank(gamepadTierRank, gamepadId),
    postTagIds: validatePostTagIds(postTagIds),
    frameRateTierRank: validatePostFrameRateTierRank(frameRateTierRank),
    systemSpecId: validateSystemSpecIdForPost(systemSpecId),
  };
  const fields = {
    postText,
    // ratingTierRank,
    // gamepadId,
    // gamepadTierRank,
    // postTagIds,
    // frameRateTierRank,
    // frameRateStutters,
    // systemSpecId,
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  // Used for Typescript type validation, should never return true by this point
  if (!isTypeRatingTierRank(ratingTierRank)) {
    return { fieldErrors, fields };
  }
  // Used for Typescript type validation, should never return true by this point
  if (
    frameRateTierRank !== 'None' &&
    !isTypeFrameRateTierRank(frameRateTierRank)
  ) {
    return { fieldErrors, fields };
  }
  // Used for Typescript type validation, should never return true by this point
  if (
    gamepadTierRank !== 'None' &&
    !isTypeGamepadTierRank(gamepadTierRank)
  ) {
    return { fieldErrors, fields };
  }

  await createPerformancePost({
    steamUserId64,
    steamAppId,
    postText,
    ratingTierRank,
    frameRateTierRank: frameRateTierRank === 'None' ? undefined : frameRateTierRank,
    frameRateStutters,
    systemSpecId: systemSpecId < 0 ? undefined : systemSpecId,
    postTagIds,
    gamepadId: gamepadId < 0 ? undefined : gamepadId,
    gamepadTierRank: gamepadTierRank === 'None' ? undefined : gamepadTierRank,
  });

  return redirect(`/apps/${steamAppId}/posts`);
}
