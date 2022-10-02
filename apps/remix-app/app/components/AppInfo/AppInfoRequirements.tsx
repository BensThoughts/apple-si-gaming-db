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
          platforms={[
            {
              platformName: 'Apple',
              platformSupported: platformMac,
              requirementsMinimum: macRequirementsMinimum,
            },
            {
              platformName: 'Windows',
              platformSupported: platformWindows,
              requirementsMinimum: pcRequirementsMinimum,
            },
            {
              platformName: 'Linux',
              platformSupported: platformLinux,
              requirementsMinimum: linuxRequirementsMinimum,
            },
          ]}
        />
      </TailwindDisclosure>
    </div>
  );
}
