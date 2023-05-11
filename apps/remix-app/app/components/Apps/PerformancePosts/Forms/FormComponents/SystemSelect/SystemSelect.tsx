import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import { usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';
import SystemSelectPopover from './SystemSelectPopover';
import type { SystemSpecSelectOption } from '../SystemSelectMenuCard/SystemSelectMenu';

export default function SystemSelect({
  systemSpecOptions,
}: {
  systemSpecOptions: SystemSpecSelectOption[];
}) {
  const { state } = usePerformancePostFormState();
  return (
    <>
      <input
        type="hidden"
        name={PerformancePostFormFieldNames.SystemSpecId}
        value={state.systemSpecSelectedOption.value}
      />
      <SystemSelectPopover systemSpecOptions={systemSpecOptions} />
    </>
  );
}
