import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import { usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';
import GamepadRatingPopover from './GamepadRatingPopover';
import type { GamepadSelectOption } from './GamepadSelectMenu';

export default function GamepadRating({
  gamepads,
}: {
  gamepads: GamepadSelectOption[];
}) {
  const { state } = usePerformancePostFormState();
  return (
    <>
      <input
        type="hidden"
        name={PerformancePostFormFieldNames.GamepadId}
        value={state.gamepadSelectedOption.value}
      />
      <input
        type="hidden"
        name={PerformancePostFormFieldNames.GamepadTierRank}
        value={state.gamepadTierRankSelectedOption.value}
      />
      <GamepadRatingPopover gamepads={gamepads} />
    </>
  );
}
