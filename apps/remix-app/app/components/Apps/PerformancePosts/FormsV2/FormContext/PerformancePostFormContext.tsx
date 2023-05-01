import { createContext, useContext, useReducer } from 'react';
import type { Dispatch } from 'react';
import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
} from '~/types';

export const PerformancePostFormContext = createContext(null);
export const PerformancePostDispatchContext = createContext(null);

type PerformancePostFormState = {
  ratingTierRank?: RatingTierRank;
  frameRateTierRank?: FrameRateTierRank;
  frameRateStutters: boolean;
  gamepadName?: string; // prop is "description" in database
  gamepadValue?: number; // prop is "id" in database
  gamepadTierRank?: GamepadTierRank;
}

const initialState: PerformancePostFormState = {
  frameRateStutters: false,
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
  payload: RatingTierRank | undefined
}

type SetFrameRateTierRankAction = {
  type: PerformancePostFormStateActions.SET_FRAME_RATE_TIER_RANK,
  payload: FrameRateTierRank | undefined
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
  payload: GamepadTierRank | undefined;
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
      return { ...state, ratingTierRank: action.payload };
    }
    case PerformancePostFormStateActions.SET_FRAME_RATE_TIER_RANK: {
      return { ...state, frameRateTierRank: action.payload };
    }
    case PerformancePostFormStateActions.SET_FRAME_RATE_STUTTERS: {
      return { ...state, frameRateStutters: action.payload };
    }
    case PerformancePostFormStateActions.SET_GAMEPAD_OPTION: {
      const gamepadName = action.payload ? action.payload.name : undefined;
      const gamepadValue = action.payload ? action.payload.value : undefined;
      return { ...state, gamepadName, gamepadValue };
    }
    case PerformancePostFormStateActions.SET_GAMEPAD_TIER_RANK: {
      return { ...state, gamepadTierRank: action.payload };
    }
    case PerformancePostFormStateActions.UPSERT_FORM_STATE: {
      return { ...state, ...action.payload }
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
