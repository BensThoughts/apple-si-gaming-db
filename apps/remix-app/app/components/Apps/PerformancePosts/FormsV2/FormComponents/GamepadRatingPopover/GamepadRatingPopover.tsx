import TailwindPopover from '~/components/HeadlessComponents/TailwindPopover';
import { GamepadIcon } from '~/components/Icons/FeatherIcons';
import type { GamepadOption } from '~/types';
import GamepadTierRankRadioGroup from './GamepadTierRankRadioGroup';
import GamepadListbox from './GamepadListbox';

export default function GamepadRatingPopover({
  gamepads,
  defaultGamepadId,
}: {
  gamepads: GamepadOption[];
  defaultGamepadId?: number; // defaultValue
}) {
  return (
    <TailwindPopover buttonText="Gamepad" Icon={GamepadIcon}>
      <div className="flex flex-col gap-4 p-3">
        <GamepadListbox
          gamepads={gamepads}
        />
        <GamepadTierRankRadioGroup />
      </div>
    </TailwindPopover>
  );
}
