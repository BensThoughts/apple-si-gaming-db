import { createContext, useContext, useReducer } from 'react';
import type { Dispatch } from 'react';
import type { GamepadTierRankOption } from '../FormComponents/GamepadRating/GamepadTierRankRadioGroup';
import type { FrameRateTierRankOption } from '../FormComponents/FrameRateRating/FrameRateTierRankRadioGroup';
import type { RatingTierRankSelectOption } from '../FormComponents/RatingTierRankSelectMenu';
import type { GamepadListboxOption } from '../FormComponents/GamepadRating/GamepadListbox';
import type { PostTagMultiSelectOption } from '../FormComponents/PostTagMultiSelectMenu';
import type { SystemSpecSelectOption } from '../FormComponents/SystemSelectMenuCard/SystemSelectMenu';
import {
  initialFrameRateStuttersValue,
  initialFrameRateTierRankSelectOption,
  initialGamepadOption,
  initialGamepadTierRankOption,
  initialPostTagMultiSelectOption,
  initialRatingTierRankSelectOption,
  initialSystemSpecOption,
} from './initialFormOptions';

export const PerformancePostFormContext = createContext(null);
export const PerformancePostDispatchContext = createContext(null);

type PerformancePostFormState = {
  ratingTierRankSelectedOption: RatingTierRankSelectOption;
  frameRateTierRankSelectedOption: FrameRateTierRankOption;
  frameRateStuttersValue: boolean;
  gamepadSelectedOption: GamepadListboxOption; // prop is { "description": string, "id": number } in database
  gamepadTierRankSelectedOption: GamepadTierRankOption;
  postTagMultiSelectOption: PostTagMultiSelectOption[];
  systemSpecSelectedOption: SystemSpecSelectOption;
}

const initialState: PerformancePostFormState = {
  ratingTierRankSelectedOption: initialRatingTierRankSelectOption,
  frameRateTierRankSelectedOption: initialFrameRateTierRankSelectOption,
  frameRateStuttersValue: initialFrameRateStuttersValue,
  gamepadSelectedOption: initialGamepadOption,
  gamepadTierRankSelectedOption: initialGamepadTierRankOption,
  systemSpecSelectedOption: initialSystemSpecOption,
  postTagMultiSelectOption: initialPostTagMultiSelectOption,
};

export enum PerformancePostFormStateActions {
  SET_RATING_TIER_RANK = 'set-rating-tier-rank',
  SET_FRAME_RATE_TIER_RANK = 'set-frame-rate-tier-rank',
  SET_FRAME_RATE_STUTTERS = 'set-frame-rate-stutters',
  SET_GAMEPAD_OPTION = 'set-gamepad-option',
  SET_GAMEPAD_TIER_RANK = 'set-gamepad-tier-rank',
  SET_POST_TAG_MULTI_SELECT = 'set-post-tag-multi-select',
  SET_SYSTEM_SPEC_OPTION = 'set-system-spec-option',
  RESET_FORM_STATE = 'reset-form-state',
  UPSERT_FORM_STATE = 'upsert-form-state',
}

type SetRatingTierRankAction = {
  type: PerformancePostFormStateActions.SET_RATING_TIER_RANK,
  payload: RatingTierRankSelectOption;
}

type SetFrameRateTierRankAction = {
  type: PerformancePostFormStateActions.SET_FRAME_RATE_TIER_RANK,
  payload: FrameRateTierRankOption;
}

type SetFrameRateStuttersAction = {
  type: PerformancePostFormStateActions.SET_FRAME_RATE_STUTTERS;
  payload: boolean;
}

type SetGamepadOptionAction = {
  type: PerformancePostFormStateActions.SET_GAMEPAD_OPTION;
  payload: GamepadListboxOption;
}

type SetGamepadTierRankAction = {
  type: PerformancePostFormStateActions.SET_GAMEPAD_TIER_RANK;
  payload: GamepadTierRankOption;
}

type SetPostTagMultiSelectOptionAction = {
  type: PerformancePostFormStateActions.SET_POST_TAG_MULTI_SELECT;
  payload: PostTagMultiSelectOption[];
}

type SetSystemSpecOptionAction = {
  type: PerformancePostFormStateActions.SET_SYSTEM_SPEC_OPTION;
  payload: SystemSpecSelectOption;
}

type UpsertFormStateAction = {
  type: PerformancePostFormStateActions.UPSERT_FORM_STATE;
  payload: PerformancePostFormState;
}

type ResetFormStateAction = {
  type: PerformancePostFormStateActions.RESET_FORM_STATE;
  payload: undefined;
}

type FormRatingAction =
  | SetRatingTierRankAction
  | SetFrameRateTierRankAction
  | SetFrameRateStuttersAction
  | SetGamepadOptionAction
  | SetGamepadTierRankAction
  | SetPostTagMultiSelectOptionAction
  | SetSystemSpecOptionAction
  | UpsertFormStateAction
  | ResetFormStateAction

type DispatchFormRatingAction = Dispatch<FormRatingAction>;

function performancePostFormReducer(
    state: PerformancePostFormState,
    action: FormRatingAction,
): PerformancePostFormState {
  switch (action.type) {
    case PerformancePostFormStateActions.SET_RATING_TIER_RANK: {
      return {
        ...state,
        ratingTierRankSelectedOption: action.payload,
      };
    }
    case PerformancePostFormStateActions.SET_FRAME_RATE_TIER_RANK: {
      return { ...state, frameRateTierRankSelectedOption: action.payload };
    }
    case PerformancePostFormStateActions.SET_FRAME_RATE_STUTTERS: {
      return { ...state, frameRateStuttersValue: action.payload };
    }
    case PerformancePostFormStateActions.SET_GAMEPAD_OPTION: {
      return { ...state, gamepadSelectedOption: action.payload };
    }
    case PerformancePostFormStateActions.SET_GAMEPAD_TIER_RANK: {
      return { ...state, gamepadTierRankSelectedOption: action.payload };
    }
    case PerformancePostFormStateActions.SET_POST_TAG_MULTI_SELECT: {
      return {
        ...state,
        postTagMultiSelectOption: action.payload };
    }
    case PerformancePostFormStateActions.SET_SYSTEM_SPEC_OPTION: {
      return { ...state, systemSpecSelectedOption: action.payload };
    }
    case PerformancePostFormStateActions.UPSERT_FORM_STATE: {
      return { ...state, ...action.payload };
    }
    case PerformancePostFormStateActions.RESET_FORM_STATE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

const FormRatingContext = createContext<
  { state: PerformancePostFormState, dispatch: DispatchFormRatingAction } | undefined
>(undefined);

type FormRatingsProviderProps = { children: React.ReactNode };

function PerformancePostFormStateProvider({ children }: FormRatingsProviderProps) {
  const [state, dispatch] = useReducer(performancePostFormReducer, initialState);
  const value = { state, dispatch };
  return (
    <FormRatingContext.Provider value={value}>
      {children}
    </FormRatingContext.Provider>
  );
}

function usePerformancePostFormState() {
  const context = useContext(FormRatingContext);
  if (context === undefined) {
    throw new Error('useFormRatingState must be used within FormRatingProvider');
  }
  return context;
}

export { PerformancePostFormStateProvider, usePerformancePostFormState };
