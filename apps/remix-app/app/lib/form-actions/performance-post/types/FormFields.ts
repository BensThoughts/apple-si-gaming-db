import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
} from '~/types/remix-app';

export type PerformancePostFormError = string;

export type PerformancePostFormFieldErrors ={
  postText?: string;
  postHTML?: string;
  serializedLexicalEditorState?: string;
  ratingTierRank?: string;
  frameRateTierRank?: string;
  frameRateStutters?: string;
  gamepadId?: string;
  gamepadTierRank?: string;
  postTagIds?: string;
  systemSpecId?: string;
}

export type PerformancePostFormFieldsTyped = {
  postContent?: {
    postText: string;
    postHTML?: string;
    serializedLexicalEditorState: string;
  }
  ratingTierRank?: RatingTierRank;
  frameRateTierRank?: FrameRateTierRank;
  frameRateStutters?: boolean;
  gamepadId?: number;
  gamepadTierRank?: GamepadTierRank;
  postTagIds?: number[];
  systemSpecId?: number;
}

// This is from FormData (with some casting to number in a few cases)
export type PerformancePostFormFieldsRaw = {
  postContent: {
    postText: string;
    postHTML: string;
    serializedLexicalEditorState: string;
  }
  ratingTierRank: string;
  frameRateTierRank: string;
  frameRateStutters: boolean;
  gamepadId: number;
  gamepadTierRank: string;
  postTagIds: number[];
  systemSpecId: number;
}
