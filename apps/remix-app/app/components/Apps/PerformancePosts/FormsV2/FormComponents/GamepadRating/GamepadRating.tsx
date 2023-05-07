import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import { usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';
import GamepadRatingPopover from './GamepadRatingPopover';
import type { GamepadOption } from '~/types/remix-app';

export default function GamepadRating({
  gamepads,
}: {
  gamepads: GamepadOption[];
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
