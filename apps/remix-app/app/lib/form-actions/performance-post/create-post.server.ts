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
import type { CreateOrEditPerformancePostActionData } from './types';
import { extractFormData } from './extract-form-data';
import { getPerformancePostFormSession } from '~/lib/sessions/performance-post-form-session.server';

export const badRequest = (data: CreateOrEditPerformancePostActionData) => json({ success: false, ...data }, { status: 400 });

export async function createPerformancePostAction({
  steamAppId,
  steamUserId64,
  formData,
  request,
} : {
  steamAppId: number;
  steamUserId64: string;
  formData: FormData;
  request: Request;
}) {
  const {
    formError,
    fieldsRaw,
  } = extractFormData(formData);
  if (formError || !fieldsRaw) {
    return badRequest({ formError });
  }
  const {
    postContent: {
      postHTML,
      postText,
      serializedLexicalEditorState,
    },
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
    postHTML,
    serializedLexicalEditorState,
    ratingTierRank: isTypeRatingTierRank(ratingTierRank) ? ratingTierRank : undefined,
    frameRateTierRank: isTypeFrameRateTierRank(frameRateTierRank) ? frameRateTierRank : undefined,
    frameRateStutters,
    gamepadId,
    gamepadTierRank: isTypeGamepadTierRank(gamepadTierRank) ? gamepadTierRank : undefined,
    postTagIds,
    systemSpecId,
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  // Used for Typescript type validation, should never return true by this point
  if (!isTypeRatingTierRank(ratingTierRank)) {
    return badRequest({ fieldErrors, fields });
  }
  // Used for Typescript type validation, should never return true by this point
  if (
    frameRateTierRank !== 'None' &&
    !isTypeFrameRateTierRank(frameRateTierRank)
  ) {
    return badRequest({ fieldErrors, fields });
  }
  // Used for Typescript type validation, should never return true by this point
  if (
    gamepadTierRank !== 'None' &&
    !isTypeGamepadTierRank(gamepadTierRank)
  ) {
    return badRequest({ fieldErrors, fields });
  }

  await createPerformancePost({
    steamUserId64,
    steamAppId,
    postText,
    postHTML,
    serializedLexicalEditorState,
    ratingTierRank,
    frameRateTierRank: frameRateTierRank === 'None' ? undefined : frameRateTierRank,
    frameRateStutters,
    systemSpecId: systemSpecId < 0 ? undefined : systemSpecId,
    postTagIds,
    gamepadId: gamepadId < 0 ? undefined : gamepadId,
    gamepadTierRank: gamepadTierRank === 'None' ? undefined : gamepadTierRank,
  });

  const performancePostFormSession = await getPerformancePostFormSession(request);
  performancePostFormSession.setWasSubmittedSuccessfully(true);
  return redirect(`/apps/${steamAppId}/posts`, {
    headers: {
      'Set-Cookie': await performancePostFormSession.commit(),
    },
  });
}
