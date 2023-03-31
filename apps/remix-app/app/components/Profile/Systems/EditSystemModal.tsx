import { Form, useSubmit } from '@remix-run/react';
import React, { useState } from 'react';
import MaterialInputOutlinedV2 from '~/components/FormComponents/MaterialInputOutlinedV2';
// import MaterialInputOutlinedNew from '~/components/FormComponents/MaterialInputOutlinedNew';
import RoundedButton from '~/components/Buttons/RoundedButton';
import { validateNewSystemName } from '~/lib/form-validators/profile';
import BasicModal from '~/components/BasicModal';

interface EditSystemModalProps {
  systemSpecId: number;
  systemName: string;
  currentSystemNames: string[];
  title: string;
  description?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditSystemModal({
  systemSpecId,
  systemName,
  currentSystemNames,
  title,
  isOpen,
  setIsOpen,
}: EditSystemModalProps) {
  // const fetcher = useFetcher();
  const submit= useSubmit();
  const [systemNameValue, setSystemNameValue] = useState('');
  const [systemNameTouched, setSystemNameTouched] = useState(false);
  const systemNameError = validateNewSystemName(systemNameValue, currentSystemNames);
  const displayError = systemNameTouched && Boolean(systemNameError);

  // Form must be submitted prior to closing the modal
  // or errors occur.  So we use useSubmit()
  function handleSubmitEvent(event: React.FormEvent<HTMLFormElement>) {
    submit(event.currentTarget, { replace: true });
    setSystemNameValue('');
    setSystemNameTouched(false);
    setIsOpen(false);
  }

  return (
    <BasicModal
      isOpen={isOpen}
      onClose={() => {
        setSystemNameValue('');
        setSystemNameTouched(false);
        setIsOpen(false);
      }}
      // setIsOpen={setIsOpen}
      title={title}
    >
      <div className="flex flex-col gap-4">
        <div className="text-primary-faded">
          Please choose a new name for <span className="text-secondary">{systemName}</span>
        </div>
        <Form
          action="/profile/systems"
          method="post"
          onSubmit={handleSubmitEvent}
          // onSubmit={() => {
          //   setSystemNameValue('');
          //   setSystemNameTouched(false);
          //   setIsOpen(false);
          // }}
          className="flex flex-col gap-4"
        >
          <div>
            <input type="hidden" name="_profileAction" value="editSystem" />
            <input type="hidden" name="systemSpecId" value={systemSpecId} />
            <input type="hidden" name="systemName" value={systemName} />
            <input type="hidden" name="systemNames" value={currentSystemNames} />
            {/* <MaterialInputOutlined
              name="updatedSystemName"
              label="System Name"
              defaultValue={systemName}
              // getFieldError={(systemName) => validateNewSystemName(systemName, currentSystemNames)}
              // wasSubmitted={false}
              type="input"
              required
              minLength={3}
              maxLength={25}
            /> */}
            <MaterialInputOutlinedV2
              name="updatedSystemName"
              value={systemNameValue}
              label="System Name"
              onChange={(e) => setSystemNameValue(e.currentTarget.value)}
              onBlur={() => setSystemNameTouched(true)}
              errorMessage={displayError ? systemNameError : undefined}
              type="text"
              required
              minLength={3}
              maxLength={25}
            />
          </div>
          <div className="flex gap-2">
            <RoundedButton
              type="submit"
            >
              Edit
            </RoundedButton>
            <RoundedButton
              type="button"
              onClick={() => {
                setSystemNameValue('');
                setSystemNameTouched(false);
                setIsOpen(false);
              }}
            >
            Cancel
            </RoundedButton>
          </div>

        </Form>
      </div>
    </BasicModal>
  );
}
