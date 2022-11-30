import type { CreateSystemSpecActionData, DeleteSystemSpecActionData, EditSystemSpecActionData } from '~/routes/profile/systems';
import Heading from '~/components/Heading';
import CreateSystemForm from './CreateSystemForm';
import SystemSpecDisplay from './SystemSpecDisplay';
import CreateSystemInstructions from './CreateSystemInstructions';

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
      <div className="w-full">
        <SystemSpecDisplay
          systemSpecs={systemSpecs}
          editSystemSpecActionData={editSystemSpecActionData}
          deleteSystemSpecActionData={deleteSystemSpecActionData}
        />
      </div>
      <div className="w-full flex flex-col items-center gap-3">
        <h3 className="text-secondary text-lg">Create a New System</h3>
        <div className="flex flex-col items-center xl:items-start xl:flex-row xl:justify-around w-full">
          <div>
            <CreateSystemInstructions />
          </div>
          <div className="w-full max-w-md mt-5">
            <CreateSystemForm
              isSubmittingCreateSystemForm={isSubmittingCreateSystemForm}
              createSystemSpecActionData={createSystemSpecActionData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
