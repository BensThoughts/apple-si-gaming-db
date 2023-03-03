import { useFetcher } from '@remix-run/react';
import React from 'react';
import RoundedButton from '~/components/RoundedButton';
import BasicModal from '~/components/BasicModal';

interface DeletePostModalProps {
  performancePostId: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeletePostModal({
  performancePostId,
  isOpen,
  setIsOpen,
}: DeletePostModalProps) {
  // const submit = useSubmit();
  const fetcher = useFetcher();

  // Form must be submitted prior to closing the modal
  // or errors occur.  So we use useSubmit()
  function onClick() {
    fetcher.submit({
      performancePostId: performancePostId.toString(),
    }, { action: '/actions/delete-post', method: 'post' });
    // submit(event.currentTarget, { replace: true });
    setIsOpen(false);
  }

  return (
    <BasicModal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      // setIsOpen={setIsOpen}
      title="Delete Post"
    >
      <div className="flex flex-col gap-4">
        <div className="text-primary-faded">
          Are you sure you want to delete your post?
        </div>
        <div className="flex gap-2">
          <RoundedButton
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-white focus-visible:text-white"
          >
            Cancel
          </RoundedButton>

          <RoundedButton
            onClick={onClick}
            className="text-white bg-error hover:bg-error hover:text-white focus-visible:bg-error focus-visible:text-white"
          >
              Delete
          </RoundedButton>
        </div>
      </div>
    </BasicModal>
  );
}
