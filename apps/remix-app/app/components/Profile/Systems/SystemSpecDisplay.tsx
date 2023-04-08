import { useEffect, useState } from 'react';
import { EditIcon, InformationCircleIcon, TrashIcon } from '~/components/Icons';
import DeleteSystemModal from './DeleteSystemModal';
import EditSystemModal from './EditSystemModal';
import SystemSpecsPopover from '~/components/HeadlessComponents/SystemSpecPopover';
import { showToast } from '~/components/Toasts';
import type { DeleteSystemSpecActionData, EditSystemSpecActionData } from '~/lib/form-actions/profile/interfaces';
import type { SystemSpec } from '~/interfaces';

interface SystemSpecDisplayProps {
  systemSpecs: SystemSpec[];
  editSystemSpecActionData?: EditSystemSpecActionData;
  deleteSystemSpecActionData?: DeleteSystemSpecActionData;
}

export default function SystemSpecDisplay({
  editSystemSpecActionData,
  deleteSystemSpecActionData,
  systemSpecs,
}: SystemSpecDisplayProps) {
  const [isDeleteModalOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteModalSystemName, setDeleteModalSystemName] = useState<string | undefined>(undefined);
  const [deleteModalSystemSpecId, setDeleteModalSystemSpecId] = useState<number | undefined>(undefined);

  const [isEditModalOpen, setEditModalIsOpen] = useState(false);
  const [editModalSystemName, setEditModalSystemName] = useState<string | undefined>(undefined);
  const [editModalSystemSpecId, setEditModalSystemSpecId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (systemSpecs.length > 0) {
      setDeleteModalSystemName(systemSpecs[0].systemName);
      setDeleteModalSystemSpecId(systemSpecs[0].systemSpecId);
      setEditModalSystemName(systemSpecs[0].systemName);
      setEditModalSystemSpecId(systemSpecs[0].systemSpecId);
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
      if (fieldErrors && fieldErrors.updatedSystemName) {
        showToast.error(fieldErrors.updatedSystemName);
      }
      if (fieldErrors && fieldErrors.systemSpecId) {
        showToast.error(fieldErrors.systemSpecId);
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
      if (fieldErrors && fieldErrors.systemSpecId) {
        showToast.error(fieldErrors.systemSpecId);
      }
    }
  }, [deleteSystemSpecActionData]);

  if (systemSpecs.length < 1) {
    return (
      <div
        className="bg-tertiary border-1 border-secondary-highlight p-3 rounded-lg
                   flex w-full max-w-lg justify-between items-center">
          You have no systems defined. Your systems will appear here when created.
      </div>
    );
  }

  const systemNames = systemSpecs.map((sysSpec) => sysSpec.systemName);

  function openDeleteModal(
      systemName: string,
      systemSpecId: number,
  ) {
    setDeleteModalSystemName(systemName);
    setDeleteModalSystemSpecId(systemSpecId);
    setDeleteModalIsOpen(true);
  }

  function openEditModal(
      systemName: string,
      systemSpecId: number,
  ) {
    setEditModalSystemName(systemName);
    setEditModalSystemSpecId(systemSpecId);
    setEditModalIsOpen(true);
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-3">
      {(deleteModalSystemName && deleteModalSystemSpecId) &&
        <DeleteSystemModal
          title="Delete System"
          isOpen={isDeleteModalOpen}
          setIsOpen={setDeleteModalIsOpen}
          systemName={deleteModalSystemName}
          systemSpecId={deleteModalSystemSpecId}
        />
      }
      {(editModalSystemName && editModalSystemSpecId) &&
        <EditSystemModal
          title="Edit Name"
          isOpen={isEditModalOpen}
          setIsOpen={setEditModalIsOpen}
          systemName={editModalSystemName}
          currentSystemNames={systemNames}
          systemSpecId={editModalSystemSpecId}
        />
      }

      {systemSpecs.map(({
        systemSpecId,
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
        <div
          key={systemName + idx}
          className="bg-tertiary border-1 border-secondary-highlight p-3 rounded-lg
                     flex w-full max-w-lg justify-between items-center">
          <div className="flex items-center justify-center gap-2">
            <div className="mt-[.33rem]">
              <SystemSpecsPopover
                systemSpec={{
                  manufacturer,
                  model,
                  osVersion,
                  cpuBrand,
                  videoDriver,
                  videoDriverVersion,
                  videoPrimaryVRAM,
                  memoryRAM,
                }}
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
                onClick={() => openEditModal(systemName, systemSpecId)}
                className="rounded-md py-1.5 px-2 bg-secondary hover:bg-secondary-highlight focus-visible:show-ring"
              >
                <EditIcon
                  strokeWidth={1.5}
                  className="text-primary-highlight w-7 h-7"
                />
              </button>
              <button
                onClick={() => openDeleteModal(systemName, systemSpecId)}
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
      ))}
    </div>
  );
}
