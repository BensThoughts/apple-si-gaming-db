import { Form, useSubmit } from '@remix-run/react';
import React from 'react';
import RoundedButton from '~/components/Buttons/RoundedButton';
import BasicModal from '~/components/BasicModal';

interface DeleteSystemModalProps {
  systemSpecId: number,
  systemName: string,
  title: string,
  description?: string,
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DeleteSystemModal({
  systemSpecId,
  systemName,
  title,
  isOpen,
  setIsOpen,
}: DeleteSystemModalProps) {
  // const fetcher = useFetcher();
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
      title={title}
    >
      <div className="flex flex-col gap-4">
        <div className="text-primary-faded">
          Are you sure you want to delete <span className="text-secondary">{systemName}</span>
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
            action="/profile/systems"
            method="post"
            // onSubmit={() => setIsOpen(false)}
            onSubmit={handleSubmitEvent}
          >
            <input type="hidden" name="_profileAction" value="deleteSystem" />
            {/* <input type="hidden" name="systemName" value={systemName} /> */}
            <input type="hidden" name="systemSpecId" value={systemSpecId} />
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
