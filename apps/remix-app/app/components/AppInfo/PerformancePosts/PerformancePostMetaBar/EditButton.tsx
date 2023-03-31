import { Link } from '@remix-run/react';
import { EditIcon } from '~/components/Icons';
import { EditPostURLParams } from '~/interfaces/remix-app/URLSearchParams/EditPost';

interface EditButtonProps {
  steamAppId: number;
  performancePostId: number;
  redirectToAfterEdit?: string;
}

export default function EditButton({
  steamAppId,
  performancePostId,
  redirectToAfterEdit,
}: EditButtonProps) {
  let editURL = `/apps/${steamAppId}/posts/edit/${performancePostId}`;
  if (redirectToAfterEdit) {
    const params = new URLSearchParams([
      [EditPostURLParams.REDIRECT_TO_AFTER_EDIT, redirectToAfterEdit],
    ]);
    editURL = editURL.concat(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center">
      <Link
        to={editURL.toString()}
        className="hover:text-primary-highlight bg-primary hover:bg-primary-highlight
                   focus:outline-none min-h-[38px] focus-visible:show-ring-primary
                   flex gap-1 items-center rounded-full border-secondary-highlight
                   border-1 py-1 px-3"
      >
        <div className="pb-0.5">
          <EditIcon className="stroke-1" />
        </div>
        <span className="font-normal">
          Edit
        </span>

      </Link>
    </div>
  );
}
