import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import type { GamepadOption } from '~/interfaces';

export default function GamepadSelectMenu({
  name,
  gamepads,
  defaultGamepadId,
  fieldError,
}: {
  name: string;
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
      name={name}
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
