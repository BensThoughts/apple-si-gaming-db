import { Link, useMatches } from '@remix-run/react';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '~/components/Icons';
import DeletePostModal from './DeletePostModal';
import { EditPostURLParams } from '~/lib/enums/URLSearchParams/EditPost';

interface EditAndDeleteButtonsProps {
  steamAppId: number;
  performancePostId: number;
}

export default function EditAndDeleteButtons({
  steamAppId,
  performancePostId,
}: EditAndDeleteButtonsProps) {
  const [isDeleteModalOpen, setDeleteModalIsOpen] = useState(false);
  const matches = useMatches();
  const deepestMatch = matches.length > 0
    ? matches[matches.length - 1]
    : undefined;
  const currentlyOnEditPage =
    deepestMatch && deepestMatch.id === 'routes/apps/$steamAppId/posts.edit.$performancePostId'
      ? true
      : false;
  if (currentlyOnEditPage) {
    return null;
  }
  const redirectToAfterEdit = deepestMatch && `${deepestMatch.pathname}#${performancePostId}`;
  let editURL = `/apps/${steamAppId}/posts/edit/${performancePostId}`;
  if (redirectToAfterEdit) {
    const params = new URLSearchParams([
      [EditPostURLParams.REDIRECT_TO_AFTER_EDIT, redirectToAfterEdit],
    ]);
    editURL = editURL.concat(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center divide-x-1 divide-secondary-highlight">
      <DeletePostModal
        performancePostId={performancePostId}
        isOpen={isDeleteModalOpen}
        setIsOpen={setDeleteModalIsOpen}
      />
      <Link
        to={editURL.toString()}
        className="rounded hover:text-primary-highlight bg-primary hover:bg-primary-highlight
                   focus:outline-none min-h-[38px] focus-visible:show-ring-primary
                   flex items-center rounded-l-full border-secondary-highlight
                   border-l-1 border-y-1 py-1 pl-3 pr-2"
      >
        <EditIcon />
      </Link>

      {/* <div className="border-s border-l-2 border-secondary-highlight border-solid" /> */}
      <div className="flex items-center">
        <button
          onClick={() => setDeleteModalIsOpen(true)}
          className="rounded hover:text-primary-highlight bg-primary hover:bg-primary-highlight
                     focus:outline-none min-h-[38px] focus-visible:show-ring-primary
                     flex items-center rounded-r-full border-secondary-highlight
                     border-r-1 border-y-1 py-1 pl-2 pr-3"
        >
          <TrashIcon />
        </button>
      </div>

    </div>
  );
}
