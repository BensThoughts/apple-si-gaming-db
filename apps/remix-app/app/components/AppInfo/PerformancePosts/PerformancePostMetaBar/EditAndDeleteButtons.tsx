import { Link } from '@remix-run/react';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '~/components/Icons';
import DeletePostModal from './DeletePostModal';
import { EditPostURLParams } from '~/interfaces/remix-app/URLSearchParams/EditPost';

interface EditAndDeleteButtonsProps {
  steamAppId: number;
  performancePostId: number;
  redirectToAfterEdit?: string;
}

export default function EditAndDeleteButtons({
  steamAppId,
  performancePostId,
  redirectToAfterEdit,
}: EditAndDeleteButtonsProps) {
  const [isDeleteModalOpen, setDeleteModalIsOpen] = useState(false);
  let editURL = `/apps/${steamAppId}/posts/edit/${performancePostId}`;
  if (redirectToAfterEdit) {
    const params = new URLSearchParams([
      [EditPostURLParams.REDIRECT_TO_AFTER_EDIT, redirectToAfterEdit],
    ]);
    editURL = editURL.concat(`?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 py-1 px-2 rounded-full border-secondary-highlight border-solid border-1">
      <DeletePostModal
        performancePostId={performancePostId}
        isOpen={isDeleteModalOpen}
        setIsOpen={setDeleteModalIsOpen}
      />
      <Link
        to={editURL.toString()}
        className="rounded hover:text-primary-highlight focus:outline-none focus-visible:show-ring"
      >
        <EditIcon />
      </Link>
      <div className="border-l-2 border-secondary-highlight border-solid" />
      <button
        onClick={() => setDeleteModalIsOpen(true)}
        className="rounded hover:text-primary-highlight focus:outline-none focus-visible:show-ring"
      >
        <TrashIcon />
      </button>
    </div>
  );
}
