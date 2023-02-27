import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import type { SystemSpecOption } from '~/interfaces';

export default function SystemNameSelectMenu({
  systemSpecOptions,
}: {
  systemSpecOptions: SystemSpecOption[];
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

  return (
    <SelectMenu
      name="performancePostSystemSpecId"
      defaultValue={systemNameOptions[0]}
      options={systemNameOptions}
      labelText="Select System"
    />
  );
}
