import SelectMenuWithIcon from '~/components/FormComponents/SelectMenuWithIcon';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import type { GamepadOption } from '~/types';
import { GamepadIcon } from '~/components/Icons/FeatherIcons';

export default function GamepadSelectMenu({
  name,
  gamepads,
  defaultGamepadId,
  onChange,
}: {
  name: string;
  gamepads: GamepadOption[];
  defaultGamepadId?: number; // defaultValue
  onChange?(e: SelectOption<number>): void;
}) {
  function onSelectionChange(selection: SelectOption<number>) {
    if (onChange) {
      onChange(selection);
    }
  }
  const gamepadOptions: SelectOption<number>[] = gamepads.map((gamepad) => (
    {
      name: gamepad.description,
      value: gamepad.id,
    }
  ));
  gamepadOptions.unshift({
    name: 'None',
    value: -1,
  });

  const defaultValue = gamepadOptions.find((option) => option.value === defaultGamepadId);

  return (
    <SelectMenuWithIcon
      name={name}
      defaultValue={defaultValue ? defaultValue : gamepadOptions[0]}
      options={gamepadOptions}
      labelText="Gamepad"
      onChange={onSelectionChange}
      Icon={GamepadIcon}
      // fieldError={fieldError}
    />
    // <MultiSelectMenu
    //   name="performancePostGamepadId"
    //   id={`performancePostGamepadId-${formId}`}
    //   labelText="Gamepad"
    //   options={gamepadOptions}
    //   fieldError={fieldError}
    //   isMulti={false}
    //   defaultValue={defaultValue ? [defaultValue] : undefined}
    //   closeMenuOnSelect={true}
    // />
  );
}
