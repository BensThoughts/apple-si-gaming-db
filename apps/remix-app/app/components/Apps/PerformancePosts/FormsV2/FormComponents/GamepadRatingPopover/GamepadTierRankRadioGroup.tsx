import type { RadioGroupOption } from '~/components/HeadlessComponents/TailwindRadioGroup';
import TailwindRadioGroup from '~/components/HeadlessComponents/TailwindRadioGroup';
import { convertGamepadTierRankToFullText } from '~/lib/conversions/rating-conversions';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import type { GamepadTierRank } from '~/types';
import { PerformancePostFormStateActions, usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';

type GamepadRadioGroupOption = RadioGroupOption<GamepadTierRank | 'None'>;

export const gamepadTierRankOptions: GamepadRadioGroupOption[] = [
  {
    name: 'None',
    value: 'None',
  },
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

export default function GamepadTierRankRadioGroup({
  defaultGamepadTierRank,
}: {
  defaultGamepadTierRank?: GamepadTierRank;
}) {
  const { state, dispatch } = usePerformancePostFormState();

  function onSelectionChange(selection: GamepadRadioGroupOption) {
    if (selection.value != 'None') {
      dispatch({ type: PerformancePostFormStateActions.SET_GAMEPAD_TIER_RANK, payload: selection.value });
    } else {
      dispatch({ type: PerformancePostFormStateActions.SET_GAMEPAD_TIER_RANK, payload: undefined });
    }
  }
  const { gamepadTierRank } = state;
  const defaultValue = gamepadTierRankOptions.find((option) => option.value === gamepadTierRank);
  return (
    <div className="flex flex-col gap-2">
      {/* <div className="flex w-full bg-primary-highlight px-3 py-2">
        Tier Rank
      </div> */}
        <TailwindRadioGroup
          name={PerformancePostFormFieldNames.GamepadTierRank}
          options={gamepadTierRankOptions}
          defaultValue={defaultValue ? defaultValue : gamepadTierRankOptions[0]}
          labelText="Gamepad Tier Rank"
          onChange={onSelectionChange}
        />
    </div>
  );
}
