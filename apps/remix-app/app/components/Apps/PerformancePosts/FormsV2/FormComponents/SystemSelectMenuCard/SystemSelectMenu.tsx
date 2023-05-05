import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import type { SystemSpecOption } from '~/types';
import { initialSystemSpecOption } from '../../FormContext/initialFormOptions';
import { PerformancePostFormStateActions, usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';

export type SystemSpecSelectOption = SelectOption<number>;

export default function SystemSelectMenu({
  systemSpecOptions,
}: {
  systemSpecOptions: SystemSpecOption[];
}) {
  const { state, dispatch } = usePerformancePostFormState();
  const systemNameOptions: SystemSpecSelectOption[] = systemSpecOptions.map((option) => (
    {
      name: option.systemName,
      value: option.id,
    }
  ));
  systemNameOptions.unshift(initialSystemSpecOption);

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
      options={systemNameOptions}
      labelText="System"
      onChange={onSelectionChange}
    />
  );
}
