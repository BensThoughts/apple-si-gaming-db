import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
} from '~/types';

export type PerformancePostFormFieldsTyped = {
  postText?: string;
  // postHTML?: string;
  ratingTierRank?: RatingTierRank;
  frameRateTierRank?: FrameRateTierRank;
  frameRateStutters?: boolean;
  postTagIds?: number[];
  gamepadId?: number;
  gamepadTierRank?: GamepadTierRank;
  systemSpecId?: number;
}

export type PerformancePostFormFieldsRaw = {
  postText: string;
  // postHTML: string;
  frameRateTierRank: string;
  frameRateStutters: boolean;
  ratingTierRank: string;
  systemSpecId: number;
  gamepadId: number;
  gamepadTierRank: string;
  postTagIds: number[];
}
