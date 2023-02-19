import MultiSelectMenu from '~/components/FormComponents/MultiSelectMenu';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';

export default function GamepadMultiSelectMenu({
  formId,
  gamepads,
  defaultGamepadId,
  fieldError,
}: {
  formId: string;
  gamepads: {
    gamepadId: number;
    description: string;
  }[];
  defaultGamepadId?: number; // defaultValue
  fieldError?: string;
}) {
  const gamepadOptions: MultiSelectOption<number>[] = gamepads.map((gamepad) => (
    {
      label: gamepad.description,
      value: gamepad.gamepadId,
    }
  ));
  gamepadOptions.unshift({
    label: 'None',
    value: 0,
  });

  const defaultValue = gamepadOptions.find((option) => option.value === defaultGamepadId);

  return (
    <MultiSelectMenu
      name="performancePostGamepadId"
      id={`performancePostGamepadId-${formId}`}
      labelText="Controller"
      options={gamepadOptions}
      fieldError={fieldError}
      isMulti={false}
      defaultValue={defaultValue ? [defaultValue] : undefined}
      closeMenuOnSelect={true}
    />
  );
}
