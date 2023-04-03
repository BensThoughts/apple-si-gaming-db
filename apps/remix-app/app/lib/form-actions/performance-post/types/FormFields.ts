import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
} from '~/interfaces';

export type PerformancePostFormFieldsTyped = {
  postText?: string;
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
  frameRateTierRank: string;
  frameRateStutters: boolean;
  ratingTierRank: string;
  systemSpecId: number;
  gamepadId: number;
  gamepadTierRank: string;
  postTagIds: number[];
}

export enum FieldNames {
  PostText = 'performancePostText',
  FrameRateTierRank = 'performancePostFrameRateTierRank',
  FrameRateStutters = 'performancePostFrameRateStutters',
  RatingTierRank = 'performancePostRatingTierRank',
  SystemSpecId = 'performancePostSystemSpecId',
  PostTagIds = 'performancePostTags',
  GamepadId = 'performancePostGamepadId',
  GamepadTierRank = 'performancePostGamepadTierRank'
}
