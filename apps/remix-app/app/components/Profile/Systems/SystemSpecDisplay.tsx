import { useEffect, useState } from 'react';
import { EditIcon, InformationCircleIcon, TrashIcon } from '~/components/Icons';
import DeleteSystemModal from './DeleteSystemModal';
import EditSystemModal from './EditSystemModal';
import SystemSpecsPopover from '~/components/AppInfo/PerformancePosts/SystemSpecsPopover';
import { showToast } from '~/components/Toasts';
import type { DeleteSystemSpecActionData, EditSystemSpecActionData } from '~/routes/profile/systems';

interface SystemSpecDisplayProps {
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
  editSystemSpecActionData?: EditSystemSpecActionData;
  deleteSystemSpecActionData?: DeleteSystemSpecActionData;
}

// function Wrapper({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="w-full flex flex-col justify-center items-center gap-3">
//       {children}
//     </div>
//   );
// }

export default function SystemSpecDisplay({
  editSystemSpecActionData,
  deleteSystemSpecActionData,
  systemSpecs,
}: SystemSpecDisplayProps) {
  const [isDeleteModalOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteModalSystemName, setDeleteModalSystemName] = useState<string | undefined>(undefined);

  const [isEditModalOpen, setEditModalIsOpen] = useState(false);
  const [editModalSystemName, setEditModalSystemName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (systemSpecs.length > 0) {
      setDeleteModalSystemName(systemSpecs[0].systemName);
      setEditModalSystemName(systemSpecs[0].systemName);
    }
  }, [systemSpecs]);

  useEffect(() => {
    if (editSystemSpecActionData) {
      const {
        fieldErrors,
        formError,
      } = editSystemSpecActionData;
      if (formError) {
        showToast.error(formError);
      }
      if (fieldErrors && fieldErrors.systemName) {
        showToast.error(fieldErrors.systemName);
      }
      if (fieldErrors && fieldErrors.updatedSystemName) {
        showToast.error(fieldErrors.updatedSystemName);
      }
    }
  }, [editSystemSpecActionData]);

  useEffect(() => {
    if (deleteSystemSpecActionData) {
      const {
        fieldErrors,
        formError,
      } = deleteSystemSpecActionData;
      if (formError) {
        showToast.error(formError);
      }
      if (fieldErrors && fieldErrors.systemName) {
        showToast.error(fieldErrors.systemName);
      }
    }
  }, [deleteSystemSpecActionData]);

  if (systemSpecs.length < 1) {
    return null;
    // return (
    //   <Wrapper>
    //     <div className="flex items-center justify-center w-full max-w-md border-1 border-secondary-highlight rounded-md p-4">
    //       This is where your systems go. Try creating one with the form below.
    //     </div>
    //   </Wrapper>
    // );
  }

  const systemNames = systemSpecs.map((sysSpec) => sysSpec.systemName);

  function openDeleteModal(systemName: string) {
    setDeleteModalSystemName(systemName);
    setDeleteModalIsOpen(true);
  }

  function openEditModal(systemName: string) {
    setEditModalSystemName(systemName);
    setEditModalIsOpen(true);
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-3">
      {deleteModalSystemName &&
        <DeleteSystemModal
          title="Delete System"
          isOpen={isDeleteModalOpen}
          setIsOpen={setDeleteModalIsOpen}
          systemName={deleteModalSystemName}
        />
      }
      {editModalSystemName &&
        <EditSystemModal
          title="Edit Name"
          isOpen={isEditModalOpen}
          setIsOpen={setEditModalIsOpen}
          systemName={editModalSystemName}
          currentSystemNames={systemNames}
        />
      }

      {systemSpecs.map(({
        systemName,
        manufacturer,
        model,
        osVersion,
        cpuBrand,
        videoDriver,
        videoDriverVersion,
        videoPrimaryVRAM,
        memoryRAM,
      }, idx) => (
        <div key={systemName + idx} className="w-full max-w-lg">
          <div
            className="bg-tertiary border-1
                     border-secondary-highlight p-3 rounded-lg
                     flex w-full max-w-lg justify-between items-center"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="mt-[.33rem]">
                <SystemSpecsPopover
                  systemManufacturer={manufacturer}
                  systemModel={model}
                  systemOsVersion={osVersion}
                  systemCpuBrand={cpuBrand}
                  systemVideoDriver={videoDriver}
                  systemVideoDriverVersion={videoDriverVersion}
                  systemVideoPrimaryVRAM={videoPrimaryVRAM}
                  systemMemoryRAM={memoryRAM}
                >
                  <InformationCircleIcon size={22} />
                </SystemSpecsPopover>
              </div>
              <div>{systemName}</div>
            </div>
            <div>
              <div
                className="flex gap-2"
              >
                <button
                  onClick={() => openEditModal(systemName)}
                  className="rounded-md py-1.5 px-2 bg-secondary hover:bg-secondary-highlight focus-visible:show-ring"
                >
                  <EditIcon
                    strokeWidth={1.5}
                    className="text-primary-highlight w-7 h-7"
                  />
                </button>
                <button
                  onClick={() => openDeleteModal(systemName)}
                  className="rounded-md py-1.5 px-2 bg-secondary hover:bg-secondary-highlight focus-visible:show-ring"
                >
                  <TrashIcon
                    strokeWidth={1.5}
                    className="text-primary-highlight w-7 h-7"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
