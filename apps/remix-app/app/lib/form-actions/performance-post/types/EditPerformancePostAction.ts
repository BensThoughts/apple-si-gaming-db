import type { PerformancePostFormFieldsTyped } from './FormFields';

export type EditPerformancePostActionData = {
  formError?: string;
  fields?: PerformancePostFormFieldsTyped; // used for defaultValue options
  fieldErrors?: {
    postText?: string;
    frameRateTierRank?: string;
    ratingTierRank?: string;
    systemName?: string;
    postTagIds?: string;
    gamepadId?: string;
    gamepadTierRank?: string;
  };
};
