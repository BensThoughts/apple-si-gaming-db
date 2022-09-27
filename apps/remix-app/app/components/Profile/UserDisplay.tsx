import type { ProfileActionData } from '~/routes/profile';
import AsideCard from '~/components/Cards/AsideCard';
import Heading from '~/components/Heading';
import CreateSystemForm from './CreateSystemForm';
import OwnedApps from './OwnedApps';
import SystemSpecDisplay from './SystemSpecDisplay';

interface UserDisplayProps {
  ownedApps: {
    steamAppId: number;
    name: string;
    headerImage?: string | null;
    platformMac?: boolean | null;
    genres: {
      genreId: string;
      description: string;
    }[];
  }[];
  systemSpecs: {
    systemName: string;
    manufacturer: string | null;
    model: string | null;
    cpuBrand: string | null;
    osVersion: string | null;
    videoDriver: string | null;
    videoDriverVersion: string | null;
    videoPrimaryVRAM: string | null;
    memoryRAM: string | null;
  }[],
  actionData?: ProfileActionData;
}

export default function UserDisplay({
  ownedApps,
  systemSpecs,
  actionData,
}: UserDisplayProps) {
  return (
    <div>
      <div className="flex flex-col gap-3 items-center w-full">
        <Heading>Systems</Heading>
        {systemSpecs &&
          <div className="w-full">
            <SystemSpecDisplay systemSpecs={systemSpecs} />
          </div>
        }
        <AsideCard title="System Information" iconBackground="primary" className="max-w-md">
          This is where you can define your system information. This is the
          information that will be linked to your performance posts. You can copy
          and paste your system information directly from Steam. In Steam goto
          the help menu, select System Information, right click and select copy
          all text to clipboard. Then just paste that into the text field below.
        </AsideCard>
        <div className="w-full flex flex-col items-center gap-3">
          <h3 className="text-secondary">Create a New System</h3>
          <CreateSystemForm actionData={actionData} />
        </div>
      </div>
      <div className="flex flex-col gap-3 items-center w-full">
        <Heading>Library</Heading>
        {(ownedApps && ownedApps.length > 0) ? (
          <div>
            <OwnedApps ownedApps={ownedApps} />
          </div>
        ) : (
          <div>
            You are logged in but appear to have no apps owned. Is your Steam profile
            set to public?
          </div>
        )}
      </div>
    </div>
  );
}
