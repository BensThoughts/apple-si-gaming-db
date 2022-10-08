import { Form } from '@remix-run/react';
import AsideCard from '~/components/Cards/AsideCard';
import Heading from '~/components/Heading';
import type {
  CreateSystemSpecActionData,
  DeleteSystemSpecActionData,
  EditSystemSpecActionData,
} from '~/routes/profile';
import RoundedButton from '../RoundedButton';
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
  createSystemSpecActionData?: CreateSystemSpecActionData;
  isSubmittingCreateSystem: boolean;
  editSystemSpecActionData?: EditSystemSpecActionData;
  deleteSystemSpecActionData?: DeleteSystemSpecActionData;
}


export default function UserDisplay({
  ownedApps,
  systemSpecs,
  createSystemSpecActionData,
  isSubmittingCreateSystem,
  editSystemSpecActionData,
  deleteSystemSpecActionData,
}: UserDisplayProps) {
  return (
    <div className="flex flex-col items-center w-full gap-10">
      <div className="flex flex-col gap-6 items-center w-full max-w-3xl p-4 rounded-lg bg-tertiary border-1 border-secondary-highlight">
        <Heading>Systems</Heading>
        <AsideCard title="System Information" iconBackground="bg-tertiary" className="max-w-md">
          This is where you can define your system information. This is the
          information that will be linked to your performance posts. You can copy
          and paste your system information directly from Steam. In Steam goto
          the help menu, select System Information, right click and select copy
          all text to clipboard. Then just paste that into the text field below.
        </AsideCard>
        <div className="w-full">
          <SystemSpecDisplay
            systemSpecs={systemSpecs}
            editSystemSpecActionData={editSystemSpecActionData}
            deleteSystemSpecActionData={deleteSystemSpecActionData}
          />
        </div>
        <div className="w-full flex flex-col items-center gap-3">
          <h3 className="text-secondary">Create a New System</h3>
          <CreateSystemForm
            isSubmittingCreateSystemForm={isSubmittingCreateSystem}
            createSystemSpecActionData={createSystemSpecActionData}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 items-center w-full p-4 bg-app-bg rounded-lg border-1 border-secondary-highlight">
        <Heading>Library</Heading>
        <AsideCard title="New Feature!" iconBackground="bg-app-bg" >
          Use the update games button to re-synchronize your steam library without logging out.
        </AsideCard>
        <Form
          action="/profile"
          method="post"
        >
          <input type="hidden" name="_profileAction" value="updateOwnedGames" />
          <RoundedButton type="submit">Update Games</RoundedButton>
        </Form>
        {(ownedApps && ownedApps.length > 0) ? (
          <div>
            <OwnedApps ownedApps={ownedApps} />
          </div>
        ) : (
          <div className="max-w-md">
            <AsideCard title="No Games Found" iconBackground="bg-app-bg">
              You are logged in but appear to have no apps owned. Is your Steam profile
              set to public?  Please set you steam profile to public and then use the
              update games button or logout and back in.
            </AsideCard>
          </div>
        )}
      </div>
    </div>
  );
}
