import DOMPurify from 'isomorphic-dompurify';

import type {
  PerformancePostFormFieldsRaw,
} from './types';

import {
  PerformancePostFormFieldNames,
} from '~/lib/enums/FormFields/PerformancePost';
import type { PerformancePostFormFieldsTyped } from './types/FormFields';
import { isTypeFrameRateTierRank, isTypeGamepadTierRank, isTypeRatingTierRank } from '~/lib/form-validators/posts';

/**
  Converts performance post form data into usable data for creating or editing a
  post. Returns a bad request 400 if there is an error in the data
*/

export function extractFormData(formData: FormData): {
  formError?: string;
  fieldsRaw?: PerformancePostFormFieldsRaw;
} {
  const postText = formData.get(PerformancePostFormFieldNames.PostText);
  const postHTML = formData.get(PerformancePostFormFieldNames.PostHTML);
  const serializedLexicalEditorState = formData.get(PerformancePostFormFieldNames.SerializedLexicalEditorState);
  const frameRateTierRank = formData.get(PerformancePostFormFieldNames.FrameRateTierRank);
  const frameRateStutters = formData.get(PerformancePostFormFieldNames.FrameRateStutters);
  const ratingTierRank = formData.get(PerformancePostFormFieldNames.RatingTierRank + '[value]');
  const systemSpecIdData = formData.get(PerformancePostFormFieldNames.SystemSpecId + '[value]');
  const postTagIdsData = formData.getAll(PerformancePostFormFieldNames.PostTagIds);
  const gamepadIdData = formData.get(PerformancePostFormFieldNames.GamepadId);
  const gamepadTierRank = formData.get(PerformancePostFormFieldNames.GamepadTierRank);

  if (
    typeof postText !== 'string' ||
    typeof postHTML !== 'string' ||
    typeof serializedLexicalEditorState !== 'string' ||
    typeof frameRateTierRank !== 'string' ||
    typeof frameRateStutters !== 'string' ||
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
      postHTML: DOMPurify.sanitize(postHTML), // TODO: is this computationally intensive?
      serializedLexicalEditorState,
      frameRateTierRank,
      frameRateStutters: frameRateStutters === 'true' ? true : false,
      ratingTierRank,
      systemSpecId,
      gamepadId,
      gamepadTierRank,
      postTagIds,
    },
  };
}

export function convertRawToTypedPerformancePostFormFields(
    formFieldsRaw: PerformancePostFormFieldsRaw,
): PerformancePostFormFieldsTyped {
  const {
    ratingTierRank,
    frameRateTierRank,
    gamepadTierRank,
  } = formFieldsRaw;
  return {
    ...formFieldsRaw,
    ratingTierRank: isTypeRatingTierRank(ratingTierRank) ? ratingTierRank : undefined,
    frameRateTierRank: isTypeFrameRateTierRank(frameRateTierRank) ? frameRateTierRank : undefined,
    gamepadTierRank: isTypeGamepadTierRank(gamepadTierRank) ? gamepadTierRank : undefined,
  };
}
