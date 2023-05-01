import SelectMenu from '~/components/FormComponents/SelectMenu';
import { Listbox } from '@headlessui/react';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import TailwindPopover from '~/components/HeadlessComponents/TailwindPopover';
import { GamepadIcon } from '~/components/Icons/FeatherIcons';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import type { GamepadOption } from '~/types';
import GamepadTierRankRadioGroup from './GamepadTierRankRadioGroup';
import GamepadListbox from './GamepadListbox';
import { useState } from 'react';
import { usePopper } from 'react-popper';

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
