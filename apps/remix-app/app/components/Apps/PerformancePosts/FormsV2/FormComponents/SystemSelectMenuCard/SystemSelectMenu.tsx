import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import type { SystemSpecOption } from '~/types';

export default function SystemSelectMenu({
  systemSpecOptions,
  defaultSystemSpecId,
}: {
  systemSpecOptions: SystemSpecOption[];
  defaultSystemSpecId?: number;
}) {
  const systemNameOptions: SelectOption<number>[] = systemSpecOptions.map((option) => (
    {
      name: option.systemName,
      value: option.id,
    }
  ));
  systemNameOptions.unshift({
    name: 'None',
    value: -1,
  });

  const defaultValue = systemNameOptions.find((option) => option.value === defaultSystemSpecId);


  return (
    <SelectMenu
      name={PerformancePostFormFieldNames.SystemSpecId}
      defaultValue={defaultValue ? defaultValue : systemNameOptions[0]}
      options={systemNameOptions}
      labelText="System"
    />
  );
}
