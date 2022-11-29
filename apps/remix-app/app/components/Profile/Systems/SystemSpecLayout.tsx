import type { CreateSystemSpecActionData, DeleteSystemSpecActionData, EditSystemSpecActionData } from '~/routes/profile/systems';
import AsideCard from '~/components/Cards/AsideCard';
import Heading from '~/components/Heading';
import CreateSystemForm from './CreateSystemForm';
import SystemSpecDisplay from './SystemSpecDisplay';

interface SystemSpecLayoutProps {
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
  }[];
  isSubmittingCreateSystemForm: boolean;
  createSystemSpecActionData?: CreateSystemSpecActionData;
  editSystemSpecActionData?: EditSystemSpecActionData;
  deleteSystemSpecActionData?: DeleteSystemSpecActionData;
}

export default function SystemSpecLayout({
  systemSpecs,
  isSubmittingCreateSystemForm,
  createSystemSpecActionData,
  editSystemSpecActionData,
  deleteSystemSpecActionData,
}: SystemSpecLayoutProps) {
  return (
    <div className="flex flex-col gap-8 items-center w-full p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
      <Heading>Systems</Heading>
      <div className="w-full max-w-md border-1 border-secondary-highlight rounded-md p-4">
      Creating predefined systems makes it easier to attach system information
      to your performance posts. You can have more than one system defined.
        <strong className="font-semibold text-primary-highlight">
        &nbsp;Try it out!
        </strong>
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
          isSubmittingCreateSystemForm={isSubmittingCreateSystemForm}
          createSystemSpecActionData={createSystemSpecActionData}
        />
      </div>
    </div>
  );
}
