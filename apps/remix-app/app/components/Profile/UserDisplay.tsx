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
  isSubmittingUpdateGames: boolean;
}


export default function UserDisplay({
  ownedApps,
  systemSpecs,
  createSystemSpecActionData,
  isSubmittingCreateSystem,
  editSystemSpecActionData,
  deleteSystemSpecActionData,
  isSubmittingUpdateGames,
}: UserDisplayProps) {
  return (
    <div className="flex flex-col items-center w-full gap-10">
      <div className="flex flex-col gap-6 items-center w-full max-w-3xl p-4 rounded-lg bg-tertiary border-1 border-secondary-highlight">
        <Heading>Systems</Heading>
        <div className="w-full max-w-md border-1 border-secondary-highlight rounded-md p-4">
          Creating predefined systems makes it easier to attach system information
          to your performance posts. You can have more than one system defined.
          <span className="text-secondary">
            &nbsp;Try it out!
          </span>
        </div>
        <AsideCard title="System Information" iconBackground="bg-tertiary" className="max-w-md">
          <div className="flex flex-col gap-3">
            <div>
              Copy and paste your system information directly from Steam
              to create a system
            </div>
            <ul className="list-disc ml-6">
              <li>
                In Steam go to the help menu
              </li>
              <li>
                Select "System Information"
              </li>
              <li>
                Right click and select "copy all text to clipboard"
              </li>
              <li>
                Paste that into the system info text field below
              </li>
            </ul>
          </div>
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
      <div className="flex flex-col gap-8 items-center w-full p-4 bg-app-bg rounded-lg border-1 border-secondary-highlight">
        <Heading>Library</Heading>

        <div className="flex flex-col gap-3 items-center justify-center w-full">
          <AsideCard title="New Feature!" iconBackground="bg-app-bg" className="max-w-lg">
            Use the update library button to re-synchronize your steam library without logging out
          </AsideCard>
          <Form
            action="/profile"
            method="post"
          >
            <input type="hidden" name="_profileAction" value="updateOwnedGames" />
            <RoundedButton type="submit">
              {isSubmittingUpdateGames ? <span>Updating...</span> : <span>Update Library</span>}
            </RoundedButton>
          </Form>
        </div>

        {(ownedApps && ownedApps.length > 0) ? (
          <div>
            <OwnedApps ownedApps={ownedApps} />
          </div>
        ) : (
          <div className="max-w-md">
            <div
              className="flex flex-col gap-3 px-6 py-8 border-1 border-secondary-highlight
                         rounded-md bg-primary text-primary"
            >
              <strong className="font-bold">No Apps Found</strong>
              <div>
                You are logged in but appear to have no apps owned. Is your Steam profile
                set to public?  Please set your steam profile to public and then use the
                update games button or logout and back in.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
