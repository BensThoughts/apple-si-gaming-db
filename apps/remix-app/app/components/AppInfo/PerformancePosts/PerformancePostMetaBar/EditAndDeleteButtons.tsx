import { Link } from '@remix-run/react';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '~/components/Icons';
import DeletePostModal from './DeletePostModal';

interface EditAndDeleteButtonsProps {
  steamAppId: number;
  postId: string;
}

export default function EditAndDeleteButtons({
  steamAppId,
  postId,
}: EditAndDeleteButtonsProps) {
  const [isDeleteModalOpen, setDeleteModalIsOpen] = useState(false);
  // const [deleteModalSystemName, setDeleteModalSystemName] = useState<string | undefined>(undefined);

  return (
    <div className="flex gap-2 py-1 px-2 rounded-full border-secondary-highlight border-solid border-1">
      <DeletePostModal
        steamAppId={steamAppId}
        postId={postId}
        isOpen={isDeleteModalOpen}
        setIsOpen={setDeleteModalIsOpen}
      />
      <Link
        to={`/apps/${steamAppId}/performance-posts/edit/${postId}`}
        className="hover:text-primary-highlight"
      >
        <EditIcon />
      </Link>
      <div className="border-l-2 border-secondary-highlight border-solid" />
      <button
        onClick={() => setDeleteModalIsOpen(true)}
        className="hover:text-primary-highlight"
      >
        <TrashIcon />
      </button>
    </div>
  );
}
