import { redirect, json } from '@remix-run/node';
import type { CreatePerformancePostActionData } from '~/routes/apps/$steamAppId/performance-posts';
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
} from '~/lib/form-validators/posts';
import { validateSystemName } from '~/lib/form-validators/profile';
import { createPerformancePost } from '~/models/steamPerformancePost.server';


const badRequest = (data: CreatePerformancePostActionData) => json(data, { status: 400 });

export async function createPerformancePostAction({
  steamAppId,
  steamUserId,
  displayName,
  avatarMedium,
  formData,
} : {
  steamAppId: number;
  steamUserId: string;
  displayName?: string | null | undefined;
  avatarMedium?: string | null | undefined;
  formData: FormData;
}) {
  const postText = formData.get('performancePostText');
  const frameRateAverage = formData.get('performancePostFrameRateAverage[value]');
  const frameRateStutters = formData.get('performancePostFrameRateStutters');
  const ratingMedal = formData.get('performancePostRatingMedal[value]');
  const systemName = formData.get('performancePostSystemName[value]');
  const postTagIdsData = formData.getAll('performancePostTags');
  const gamepadIdData = formData.get('performancePostGamepadId');
  const gamepadRating = formData.get('performancePostGamepadRating[value]');

  if (
    typeof postText !== 'string' ||
    typeof frameRateAverage !== 'string' ||
    typeof ratingMedal !== 'string' ||
    typeof systemName !== 'string' ||
    typeof gamepadIdData !== 'string' ||
    typeof gamepadRating !== 'string' ||
    postTagIdsData.some((tagId) => typeof tagId !== 'string')
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  let postTagIds: number[] = [];
  if (postTagIdsData[0] !== '') {
    postTagIds = postTagIdsData.map((tagId) => Number(tagId.toString()));
  }
  const gamepadId = Number(gamepadIdData);

  const fieldErrors = {
    postText: validatePostText(postText),
    ratingMedal: validatePostRatingMedal(ratingMedal),
    gamepadId: validatePostGamepadId(gamepadId, gamepadRating),
    gamepadRating: validateGamepadRating(gamepadRating, gamepadId),
    postTags: validatePostTagIds(postTagIds),
    frameRateAverage: validatePostFrameRateAverage(frameRateAverage),
    systemName: validateSystemName(systemName),
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

  await createPerformancePost({
    steamUserId,
    avatarMedium,
    displayName,
    steamAppId,
    postText,
    frameRateAverage: frameRateAverage === 'None' ? undefined : frameRateAverage,
    frameRateStutters: frameRateStutters ? true : false,
    ratingMedal,
    systemName,
    postTagIds,
    gamepadId: gamepadId < 1 ? undefined : gamepadId,
    gamepadRating: gamepadRating === 'None' ? undefined : gamepadRating,
  });

  return redirect(`/apps/${steamAppId}/performance-posts`);
}
