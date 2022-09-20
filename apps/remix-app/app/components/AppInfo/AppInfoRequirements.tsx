import TailwindDisclosure from '~/components/AppInfo/TailwindDisclosure';
import RequirementTabs from '~/components/AppInfo/RequirementTabs';

export default function AppInfoRequirements({
  mac,
  windows,
  linux,
}: {
  mac: {
    macRequirementsMinimum?: string | null;
    platformMac?: boolean | null;
  },
  windows: {
    pcRequirementsMinimum?: string | null;
    platformWindows?: boolean | null;
  },
  linux: {
    linuxRequirementsMinimum?: string | null;
    platformLinux?: boolean | null;
  }
}) {
  const { platformMac, macRequirementsMinimum } = mac;
  const { platformWindows, pcRequirementsMinimum } = windows;
  const { platformLinux, linuxRequirementsMinimum } = linux;
  return (
    <div className="w-full">
      <TailwindDisclosure title="Requirements">
        <RequirementTabs
          mac={{ platformMac, macRequirementsMinimum }}
          windows={{ platformWindows, pcRequirementsMinimum }}
          linux={{ platformLinux, linuxRequirementsMinimum }}
        />
      </TailwindDisclosure>
    </div>
  );
}
