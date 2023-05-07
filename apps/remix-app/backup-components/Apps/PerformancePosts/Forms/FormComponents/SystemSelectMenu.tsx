// @ts-nocheck
import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import type { SystemSpecOption } from '~/types/remix-app';

export default function SystemSelectMenu({
  name,
  systemSpecOptions,
  defaultSystemSpecId,
}: {
  name: string;
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
      name={name}
      defaultValue={defaultValue ? defaultValue : systemNameOptions[0]}
      options={systemNameOptions}
      labelText="System"
    />
  );
}
