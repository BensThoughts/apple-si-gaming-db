import { redirect, json } from '@remix-run/node';
import type { CreateOrEditPerformancePostActionData } from './types';
import {
  validatePostText,
  isTypeFrameRateTierRank,
  validatePostFrameRateTierRank,
  isTypeRatingTierRank,
  validatePostRatingTierRank,
  validatePostTagIds,
  validatePostGamepadId,
  validateGamepadTierRank,
  isTypeGamepadTierRank,
  validateSystemSpecIdForPost,
} from '~/lib/form-validators/posts';
import { updatePerformancePost } from '~/models/SteamedApples/performancePost.server';
import { extractFormData } from './extract-form-data';
import { safeRedirect } from '~/lib/utils.server';
import { getPerformancePostFormSession } from '~/lib/sessions/performance-post-form-session.server';

const badRequest = (data: CreateOrEditPerformancePostActionData) => json(data, { status: 400 });

export async function editPerformancePostAction({
  steamAppId,
  performancePostId,
  formData,
  redirectToAfterEdit,
  request,
} : {
  steamAppId: number;
  performancePostId: number;
  formData: FormData;
  redirectToAfterEdit: string | null;
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
      postText,
      postHTML,
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
    postTags: validatePostTagIds(postTagIds),
    frameRateTierRank: validatePostFrameRateTierRank(frameRateTierRank),
    systemSpecId: validateSystemSpecIdForPost(systemSpecId),
    // systemName: validateSystemName(systemName),
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

  // This should never return true (used for Typescript type validation)
  if (
    frameRateTierRank !== 'None' &&
    !isTypeFrameRateTierRank(frameRateTierRank)
  ) {
    return badRequest({ fieldErrors, fields });
  }

  // This should never return true (used for Typescript type validation)
  if (!isTypeRatingTierRank(ratingTierRank)) {
    return badRequest({ fieldErrors, fields });
  }

  // This should never return true (used for Typescript type validation)
  if (
    gamepadTierRank !== 'None' &&
    !isTypeGamepadTierRank(gamepadTierRank)
  ) {
    return badRequest({ fieldErrors, fields });
  }

  await updatePerformancePost({
    performancePostId,
    postText,
    postHTML,
    serializedLexicalEditorState,
    frameRateTierRank: frameRateTierRank === 'None' ? undefined : frameRateTierRank,
    frameRateStutters,
    ratingTierRank,
    systemSpecId: systemSpecId < 0 ? undefined : systemSpecId,
    postTagIds,
    gamepadId: gamepadId < 0 ? undefined : gamepadId,
    gamepadTierRank: gamepadTierRank === 'None' ? undefined : gamepadTierRank,
  });

  const redirectTo = redirectToAfterEdit
    ? safeRedirect(redirectToAfterEdit)
    : `/apps/${steamAppId}/posts`;

  const performancePostFormSession = await getPerformancePostFormSession(request);
  performancePostFormSession.setWasSubmittedSuccessfully(true);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await performancePostFormSession.commit(),
    },
  });
}
