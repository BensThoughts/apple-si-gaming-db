import type { RadioGroupOption } from '~/components/HeadlessComponents/TailwindRadioGroup';
import TailwindRadioGroup from '~/components/HeadlessComponents/TailwindRadioGroup';
import { convertGamepadTierRankToFullText } from '~/lib/conversions/rating-conversions';
// import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import type { GamepadTierRank } from '~/types';
import { PerformancePostFormStateActions, usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';
import { initialGamepadTierRankOption } from '../../FormContext/initialValues';

export type GamepadTierRankOption = RadioGroupOption<GamepadTierRank | 'None'>;

export const gamepadTierRankOptions: GamepadTierRankOption[] = [
  initialGamepadTierRankOption,
  {
    name: convertGamepadTierRankToFullText('STier'),
    value: 'STier',
  },
  {
    name: convertGamepadTierRankToFullText('ATier'),
    value: 'ATier',
  },
  {
    name: convertGamepadTierRankToFullText('BTier'),
    value: 'BTier',
  },
  {
    name: convertGamepadTierRankToFullText('CTier'),
    value: 'CTier',
  },
  {
    name: convertGamepadTierRankToFullText('FTier'),
    value: 'FTier',
  },
];

export default function GamepadTierRankRadioGroup() {
  const { state, dispatch } = usePerformancePostFormState();

  function onSelectionChange(selection: GamepadTierRankOption) {
    dispatch({
      type: PerformancePostFormStateActions.SET_GAMEPAD_TIER_RANK,
      payload: selection,
    });
  }
  return (
    <div className="flex flex-col gap-2">
      {/* <div className="flex w-full bg-primary-highlight px-3 py-2">
        Tier Rank
      </div> */}
      <TailwindRadioGroup
        options={gamepadTierRankOptions}
        value={state.gamepadTierRankSelectedOption}
        labelText="Gamepad Tier Rank"
        onChange={onSelectionChange}
      />
    </div>
  );
}
