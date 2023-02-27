import type { FrameRate, GamepadRating, RatingMedal } from '~/interfaces/database';

export type PerformancePostFormFieldsRaw = {
  postText: string;
  frameRateAverage: string;
  frameRateStutters: boolean;
  ratingMedal: string;
  systemSpecId: number;
  gamepadId: number;
  gamepadRating: string;
  postTagIds: number[];
}

export type PerformancePostFormFieldsTyped = {
  postText?: string;
  ratingMedal?: RatingMedal;
  frameRateAverage?: FrameRate;
  frameRateStutters?: boolean;
  postTagIds?: number[];
  gamepadId?: number;
  gamepadRating?: GamepadRating;
  systemSpecId?: number;
}

export type CreateOrEditPerformancePostActionData = {
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
