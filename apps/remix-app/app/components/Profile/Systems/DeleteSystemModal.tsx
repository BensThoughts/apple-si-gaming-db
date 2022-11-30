import { Form, useSubmit } from '@remix-run/react';
import React from 'react';
import RoundedButton from '~/components/RoundedButton';
import SystemModal from './SystemModal';

interface DeleteSystemModalProps {
  systemName: string,
  title: string,
  description?: string,
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DeleteSystemModal({
  systemName,
  title,
  isOpen,
  setIsOpen,
}: DeleteSystemModalProps) {
  const submit = useSubmit();

  // Form must be submitted prior to closing the modal
  // or errors occur.  So we use useSubmit()
  function handleSubmitEvent(event: React.FormEvent<HTMLFormElement>) {
    submit(event.currentTarget, { replace: true });
    setIsOpen(false);
  }

  return (
    <SystemModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
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
            onSubmit={handleSubmitEvent}
          >
            <input type="hidden" name="_profileAction" value="deleteSystem" />
            <input type="hidden" name="systemName" value={systemName} />
            <RoundedButton
              type="submit"
              className="bg-error text-white hover:bg-error hover:text-white focus-visible:bg-error focus-visible:text-white"
            >
              Delete
            </RoundedButton>
          </Form>
        </div>
      </div>
    </SystemModal>
  );
}
