import type {
  CreateSystemSpecActionData,
  DeleteSystemSpecActionData,
  EditSystemSpecActionData,
} from '~/lib/form-actions/profile/interfaces';
import CreateSystemForm from './CreateSystemForm';
import SystemSpecDisplay from './SystemSpecDisplay';
import CreateSystemInstructions from './CreateSystemInstructions';

interface SystemSpecLayoutProps {
  systemSpecs: {
    systemSpecId: number;
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
  createSystemSpecActionData?: CreateSystemSpecActionData;
  editSystemSpecActionData?: EditSystemSpecActionData;
  deleteSystemSpecActionData?: DeleteSystemSpecActionData;
}

export default function SystemSpecLayout({
  systemSpecs,
  createSystemSpecActionData,
  editSystemSpecActionData,
  deleteSystemSpecActionData,
}: SystemSpecLayoutProps) {
  return (

    <div className="flex flex-col gap-8 items-center xl:items-start xl:flex-row
                    xl:justify-around w-full">

      <div className="w-full flex flex-col items-center gap-6 xl:order-2">
        <div className="w-full max-w-lg bg-tertiary rounded-lg p-4">
              Creating predefined systems makes it easier to attach system information
              to your posts. You can have more than one system defined.
          <strong className="font-semibold text-primary-highlight">
                &nbsp;Try it out!
          </strong>
        </div>
        <SystemSpecDisplay
          systemSpecs={systemSpecs}
          editSystemSpecActionData={editSystemSpecActionData}
          deleteSystemSpecActionData={deleteSystemSpecActionData}
        />
      </div>

      <div className="w-full flex justify-center xl:order-1">
        <CreateSystemForm
          createSystemSpecActionData={createSystemSpecActionData}
          currentSystemNames={systemSpecs.map((systemSpec) => systemSpec.systemName)}
        />
      </div>

    </div>
  );
}
