import type { FrameRate, GamepadRating, RatingMedal } from '~/interfaces/database';

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

