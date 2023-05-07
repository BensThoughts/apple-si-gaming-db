import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import { initialSystemSpecOption } from '../../FormContext/initialFormOptions';
import { PerformancePostFormStateActions, usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';

export type SystemSpecSelectOption = SelectOption<number>;

export default function SystemSelectMenu({
  systemSpecOptions,
}: {
  systemSpecOptions: SystemSpecSelectOption[];
}) {
  const { state, dispatch } = usePerformancePostFormState();

  function onSelectionChange(selection: SystemSpecSelectOption) {
    dispatch({
      type: PerformancePostFormStateActions.SET_SYSTEM_SPEC_OPTION,
      payload: selection,
    });
  }

  return (
    <SelectMenu
      name={PerformancePostFormFieldNames.SystemSpecId}
      value={state.systemSpecSelectedOption}
      options={[initialSystemSpecOption, ...systemSpecOptions]}
      labelText="System"
      onChange={onSelectionChange}
    />
  );
}
