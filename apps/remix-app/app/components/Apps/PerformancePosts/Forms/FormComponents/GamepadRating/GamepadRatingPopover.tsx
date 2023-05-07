import TailwindPopover from '~/components/HeadlessComponents/TailwindPopover';
import { GamepadIcon } from '~/components/Icons/FeatherIcons';
import GamepadTierRankRadioGroup from './GamepadTierRankRadioGroup';
import GamepadSelectMenu from './GamepadSelectMenu';
import type { GamepadSelectOption } from './GamepadSelectMenu';

export default function GamepadRatingPopover({
  gamepads,
  // defaultGamepadId,
}: {
  gamepads: GamepadSelectOption[];
  // defaultGamepadId?: number; // defaultValue
}) {
  return (
    <TailwindPopover buttonText="Gamepad" Icon={GamepadIcon}>
      <div className="flex flex-col gap-4 p-3">
        <GamepadSelectMenu
          gamepadOptions={gamepads}
        />
        <GamepadTierRankRadioGroup />
      </div>
    </TailwindPopover>
  );
}
