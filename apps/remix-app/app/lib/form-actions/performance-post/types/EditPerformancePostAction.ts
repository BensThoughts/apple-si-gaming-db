import type { PerformancePostFormFieldsTyped } from './FormFields';

export type EditPerformancePostActionData = {
  formError?: string;
  fields?: PerformancePostFormFieldsTyped; // used for defaultValue options
  fieldErrors?: {
    postText?: string;
    frameRateAverage?: string;
    ratingMedal?: string;
    systemName?: string;
    postTagIds?: string;
    gamepadId?: string;
    gamepadRating?: string;
  };
};