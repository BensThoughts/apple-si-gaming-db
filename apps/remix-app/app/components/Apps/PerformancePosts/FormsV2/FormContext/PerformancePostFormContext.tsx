import { createContext, useContext, useReducer } from 'react';
import type { Dispatch } from 'react';
import type { GamepadTierRankOption } from '../FormComponents/GamepadRating/GamepadTierRankRadioGroup';
import type { FrameRateTierRankOption } from '../FormComponents/FrameRateRating/FrameRateTierRankRadioGroup';
import type { RatingTierRankSelectOption } from '../FormComponents/RatingTierRankSelectMenu';
import type { GamepadListboxOption } from '../FormComponents/GamepadRating/GamepadListbox';

export const PerformancePostFormContext = createContext(null);
export const PerformancePostDispatchContext = createContext(null);

type PerformancePostFormState = {
  ratingTierRankValue: RatingTierRankSelectOption['value'];
  frameRateTierRankValue: FrameRateTierRankOption['value'];
  frameRateStuttersValue: boolean;
  gamepadName: GamepadListboxOption['name']; // prop is "description" in database
  gamepadValue: GamepadListboxOption['value']; // prop is "id" in database
  gamepadTierRankValue: GamepadTierRankOption['value'];
}

const initialState: PerformancePostFormState = {
  ratingTierRankValue: 'None',
  frameRateTierRankValue: 'None',
  frameRateStuttersValue: false,
  gamepadName: '',
  gamepadValue: -1,
  gamepadTierRankValue: 'None',
};

export enum PerformancePostFormStateActions {
  SET_RATING_TIER_RANK = 'set-rating-tier-rank',
  SET_FRAME_RATE_TIER_RANK = 'set-frame-rate-tier-rank',
  SET_FRAME_RATE_STUTTERS = 'set-frame-rate-stutters',
  SET_GAMEPAD_OPTION = 'set-gamepad-option',
  SET_GAMEPAD_TIER_RANK = 'set-gamepad-tier-rank',
  RESET_FORM_STATE = 'reset-form-state',
  UPSERT_FORM_STATE = 'upsert-form-state',
}

type SetRatingTierRankAction = {
  type: PerformancePostFormStateActions.SET_RATING_TIER_RANK,
  payload: RatingTierRankSelectOption['value']
}

type SetFrameRateTierRankAction = {
  type: PerformancePostFormStateActions.SET_FRAME_RATE_TIER_RANK,
  payload: FrameRateTierRankOption['value']
}

type SetFrameRateStuttersAction = {
  type: PerformancePostFormStateActions.SET_FRAME_RATE_STUTTERS;
  payload: boolean;
}

type SetGamepadOptionAction = {
  type: PerformancePostFormStateActions.SET_GAMEPAD_OPTION;
  payload: { name: string, value: number } | undefined;
}

type SetGamepadRatingTierRankAction = {
  type: PerformancePostFormStateActions.SET_GAMEPAD_TIER_RANK;
  payload: GamepadTierRankOption['value'];
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
  | SetGamepadRatingTierRankAction
  | UpsertFormStateAction
  | ResetFormStateAction

type DispatchFormRatingAction = Dispatch<FormRatingAction>;

function performancePostFormReducer(
    state: PerformancePostFormState,
    action: FormRatingAction,
): PerformancePostFormState {
  switch (action.type) {
    case PerformancePostFormStateActions.SET_RATING_TIER_RANK: {
      return { ...state, ratingTierRankValue: action.payload };
    }
    case PerformancePostFormStateActions.SET_FRAME_RATE_TIER_RANK: {
      return { ...state, frameRateTierRankValue: action.payload };
    }
    case PerformancePostFormStateActions.SET_FRAME_RATE_STUTTERS: {
      return { ...state, frameRateStuttersValue: action.payload };
    }
    case PerformancePostFormStateActions.SET_GAMEPAD_OPTION: {
      const gamepadName = action.payload ? action.payload.name : '';
      const gamepadValue = action.payload ? action.payload.value : -1;
      return { ...state, gamepadName, gamepadValue };
    }
    case PerformancePostFormStateActions.SET_GAMEPAD_TIER_RANK: {
      return { ...state, gamepadTierRankValue: action.payload };
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
