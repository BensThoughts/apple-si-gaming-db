import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';

export default function SystemNameSelectMenu({
  systemNames,
}: {
  systemNames: string[];
}) {
  const systemNameOptions: SelectOption[] = systemNames.map((sysName) => (
    {
      name: sysName,
      value: sysName,
    }
  ));
  systemNameOptions.unshift({
    name: 'None',
    value: 'None',
  });

  return (
    <SelectMenu
      name="performancePostSystemName"
      defaultValue={systemNameOptions[0]}
      options={systemNameOptions}
      labelText="Select System"
    />
  );
}
