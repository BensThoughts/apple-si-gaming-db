import { PerformancePostFormStateActions, usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';
import { initialGamepadOption } from '../../FormContext/initialFormOptions';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import SelectMenu from '~/components/FormComponents/SelectMenu';

export type GamepadSelectOption = SelectOption<number>;

export default function GamepadSelectMenu({
  gamepadOptions,
}: {
  gamepadOptions: GamepadSelectOption[];
}) {
  const { state, dispatch } = usePerformancePostFormState();

  function onSelectionChange(selection: GamepadSelectOption) {
    dispatch({
      type: PerformancePostFormStateActions.SET_GAMEPAD_OPTION,
      payload: {
        name: selection.name,
        value: selection.value,
      },
    });
  }

  return (
    <SelectMenu
      options={[initialGamepadOption, ...gamepadOptions]}
      value={state.gamepadSelectedOption}
      onChange={onSelectionChange}
      outlineStyle
      labelText="select gamepad"
      showLabel={false}
    />
  );
}
