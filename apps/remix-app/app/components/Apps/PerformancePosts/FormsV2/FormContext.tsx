import { createContext, useContext, useReducer } from 'react';
import type { Dispatch } from 'react';
import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadOption,
  GamepadTierRank,
} from '~/types';

export const PerformancePostFormContext = createContext(null);
export const PerformancePostDispatchContext = createContext(null);


type PerformancePostFormRatingState = {
  ratingTierRank?: RatingTierRank;
  frameRateTierRank?: FrameRateTierRank;
  frameRateStutters: boolean;
  gamepadOption?: GamepadOption;
  gamepadTierRank?: GamepadTierRank;
}

const initialState: PerformancePostFormRatingState = {
  frameRateStutters: false,
};

export enum RatingActions {
  SET_RATING_TIER_RANK = 'set-rating-tier-rank',
  SET_FRAME_RATE_TIER_RANK = 'set-frame-rate-tier-rank',
  SET_FRAME_RATE_STUTTERS = 'set-frame-rate-stutters',
  SET_GAMEPAD_OPTION = 'set-gamepad-option',
  SET_GAMEPAD_TIER_RANK = 'set-gamepad-tier-rank',
  RESET_RATING_STATE = 'reset-rating-state',
}

type SetRatingTierRankAction = {
  type: RatingActions.SET_RATING_TIER_RANK,
  payload: RatingTierRank | undefined
}

type SetFrameRateTierRankAction = {
  type: RatingActions.SET_FRAME_RATE_TIER_RANK,
  payload: FrameRateTierRank | undefined
}

type SetFrameRateStuttersAction = {
  type: RatingActions.SET_FRAME_RATE_STUTTERS;
  payload: boolean;
}

type SetGamepadOption = {
  type: RatingActions.SET_GAMEPAD_OPTION;
  payload: GamepadOption | undefined;
}

type SetGamepadRatingTierRank = {
  type: RatingActions.SET_GAMEPAD_TIER_RANK;
  payload: GamepadTierRank | undefined;
}

type ResetRatingStateAction = {
  type: RatingActions.RESET_RATING_STATE;
  payload: undefined;
}

type FormRatingAction =
  | SetRatingTierRankAction
  | SetFrameRateTierRankAction
  | SetFrameRateStuttersAction
  | SetGamepadOption
  | SetGamepadRatingTierRank
  | ResetRatingStateAction

type DispatchFormRatingAction = Dispatch<FormRatingAction>;

function performancePostFormReducer(
    state: PerformancePostFormRatingState,
    action: FormRatingAction,
): PerformancePostFormRatingState {
  switch (action.type) {
    case RatingActions.SET_RATING_TIER_RANK: {
      return { ...state, ratingTierRank: action.payload };
    }
    case RatingActions.SET_FRAME_RATE_TIER_RANK: {
      return { ...state, frameRateTierRank: action.payload };
    }
    case RatingActions.SET_FRAME_RATE_STUTTERS: {
      return { ...state, frameRateStutters: action.payload };
    }
    case RatingActions.SET_GAMEPAD_OPTION: {
      return { ...state, gamepadOption: action.payload };
    }
    case RatingActions.SET_GAMEPAD_TIER_RANK: {
      return { ...state, gamepadTierRank: action.payload };
    }
    case RatingActions.RESET_RATING_STATE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

const FormRatingContext = createContext<
  { state: PerformancePostFormRatingState, dispatch: DispatchFormRatingAction } | undefined
>(undefined);

type FormRatingsProviderProps = { children: React.ReactNode };

function FormRatingProvider({ children }: FormRatingsProviderProps) {
  const [state, dispatch] = useReducer(performancePostFormReducer, initialState);
  const value = { state, dispatch };
  return (
    <FormRatingContext.Provider value={value}>
      {children}
    </FormRatingContext.Provider>
  );
}

function useFormRatingState() {
  const context = useContext(FormRatingContext);
  if (context === undefined) {
    throw new Error('useFormRatingState must be used within FormRatingProvider');
  }
  return context;
}

export { FormRatingProvider, useFormRatingState };
