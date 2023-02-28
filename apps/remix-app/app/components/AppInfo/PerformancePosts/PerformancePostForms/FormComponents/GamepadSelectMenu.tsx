import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import type { GamepadOption } from '~/interfaces';

export default function GamepadSelectMenu({
  gamepads,
  defaultGamepadId,
  fieldError,
}: {
  gamepads: GamepadOption[];
  defaultGamepadId?: number; // defaultValue
  fieldError?: string;
}) {
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
    <SelectMenu
      name="performancePostGamepadId"
      defaultValue={defaultValue ? defaultValue : gamepadOptions[0]}
      options={gamepadOptions}
      labelText="Controller"
      fieldError={fieldError}
    />
    // <MultiSelectMenu
    //   name="performancePostGamepadId"
    //   id={`performancePostGamepadId-${formId}`}
    //   labelText="Controller"
    //   options={gamepadOptions}
    //   fieldError={fieldError}
    //   isMulti={false}
    //   defaultValue={defaultValue ? [defaultValue] : undefined}
    //   closeMenuOnSelect={true}
    // />
  );
}
