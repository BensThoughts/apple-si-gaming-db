import { Form, useSubmit } from '@remix-run/react';
import React from 'react';
import Input from '~/components/FormComponents/Input';
import RoundedButton from '~/components/RoundedButton';
import SystemModal from './SystemModal';

interface EditSystemModalProps {
  systemName: string,
  systemNames: string[],
  title: string,
  description?: string,
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EditSystemModal({
  systemName,
  systemNames,
  title,
  isOpen,
  setIsOpen,
}: EditSystemModalProps) {
  const submit = useSubmit();

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
          Please choose a new name for <span className="text-secondary">{systemName}</span>
        </div>
        <Form
          action="/profile"
          method="post"
          onSubmit={handleSubmitEvent}
          className="flex flex-col gap-4"
        >
          <div>
            <input type="hidden" name="_profileAction" value="editSystem" />
            <input type="hidden" name="systemName" value={systemName} />
            <input type="hidden" name="systemNames" value={systemNames} />
            <Input
              name="updatedSystemName"
              label="System Name..."
              required
              maxLength={25}
              minLength={3}
            />
          </div>
          <div className="flex gap-2">
            <RoundedButton
              type="submit"
              className="text-primary-highlight inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Edit
            </RoundedButton>
            <RoundedButton
              type="button"
              className="text-primary-highlight inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={() => setIsOpen(false)}
            >
            Cancel
            </RoundedButton>
          </div>

        </Form>
      </div>
    </SystemModal>
  );
}
