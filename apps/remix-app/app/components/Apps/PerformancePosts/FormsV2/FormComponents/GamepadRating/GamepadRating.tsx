import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import { usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';
import GamepadRatingPopover from './GamepadRatingPopover';
import { GamepadOption } from '~/types';

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
        value={state.gamepadValue}
      />
      <input
        type="hidden"
        name={PerformancePostFormFieldNames.GamepadTierRank}
        value={state.gamepadTierRankValue}
      />
      <GamepadRatingPopover gamepads={gamepads} />
    </>
  );
}