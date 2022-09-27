import { useEffect, useState } from 'react';
import { EditIcon, InformationCircleIcon, TrashIcon } from '~/components/Icons';
import DeleteSystemModal from './DeleteSystemModal';
import EditSystemModal from './EditSystemModal';
import SystemSpecsPopover from '~/components/AppInfo/PerformancePosts/SystemSpecsPopover';
import RoundedButton from '../RoundedButton';

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
}

function Wrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-3">
      {children}
    </div>
  );
}

export default function SystemSpecDisplay({
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

  if (systemSpecs.length < 1) {
    return (
      <Wrapper>
        <div>
          This is where your systems go. Try creating one with the form below.
        </div>
      </Wrapper>
    );
  }

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
                <RoundedButton onClick={() => openEditModal(systemName)}>
                  <EditIcon />
                </RoundedButton>
                <RoundedButton onClick={() => openDeleteModal(systemName)}>
                  <TrashIcon />
                </RoundedButton>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
