import TailwindDisclosure from '~/components/HeadlessComponents/TailwindDisclosure';
import RequirementTabs from '~/components/Apps/AppInfo/RequirementTabs';

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
  if (!macRequirementsMinimum && !pcRequirementsMinimum && !linuxRequirementsMinimum) {
    return null;
  }
  return (
    <div className="w-full">
      <TailwindDisclosure title="Requirements" defaultOpen={false}>
        <div className="p-2 bg-tertiary rounded-b-lg">
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
        </div>

      </TailwindDisclosure>
    </div>
  );
}
