import { Form, useSubmit } from '@remix-run/react';
import React from 'react';
import RoundedButton from '~/components/RoundedButton';
import BasicModal from '~/components/BasicModal';

interface DeletePostModalProps {
  steamAppId: number;
  postId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeletePostModal({
  steamAppId,
  postId,
  isOpen,
  setIsOpen,
}: DeletePostModalProps) {
  const submit = useSubmit();

  // Form must be submitted prior to closing the modal
  // or errors occur.  So we use useSubmit()
  function handleSubmitEvent(event: React.FormEvent<HTMLFormElement>) {
    submit(event.currentTarget, { replace: true });
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
          <Form
            action={`/apps/${steamAppId}/performance-posts`}
            method="post"
            onSubmit={handleSubmitEvent}
          >
            <input type="hidden" name="_performancePostAction" value="deletePerformancePost" />
            <input type="hidden" name="postId" value={postId} />
            <RoundedButton
              type="submit"
              className="text-white bg-error hover:bg-error hover:text-white focus-visible:bg-error focus-visible:text-white"
            >
              Delete
            </RoundedButton>
          </Form>
        </div>
      </div>
    </BasicModal>
  );
}
