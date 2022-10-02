import { Form } from '@remix-run/react';
import Input from '~/components/FormComponents/Input';
import TextArea from '~/components/FormComponents/TextArea';
import RoundedButton from '~/components/RoundedButton';
import type { CreateSystemSpecActionData } from '~/routes/profile';
import { showToast } from '~/components/Toasts';
import { useEffect, useRef } from 'react';

interface CreateSystemFormProps {
  isSubmittingCreateSystemForm: boolean;
  createSystemSpecActionData?: CreateSystemSpecActionData;
}

export default function CreateSystemForm({
  isSubmittingCreateSystemForm,
  createSystemSpecActionData,
}: CreateSystemFormProps) {
  useEffect(() => {
    if (createSystemSpecActionData) {
      const {
        fieldErrors,
        formError,
      } = createSystemSpecActionData;
      if (formError) {
        showToast.error(formError);
      }
      if (fieldErrors && fieldErrors.systemName) {
        showToast.error(fieldErrors.systemName);
      }
      if (fieldErrors && fieldErrors.systemInfo) {
        showToast.error(fieldErrors.systemInfo);
      }
    }
  }, [createSystemSpecActionData]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isSubmittingCreateSystemForm) {
      formRef.current?.reset();
    }
  }, [isSubmittingCreateSystemForm]);

  return (
    <Form
      action="/profile"
      method="post"
      ref={formRef}
      className="w-full max-w-lg flex flex-col items-center gap-3"
    >
      <input type="hidden" name="_profileAction" value="createSystem" />
      <Input
        name="systemName"
        label="System Name..."
        defaultValue={
          createSystemSpecActionData?.fields
          ? createSystemSpecActionData.fields.systemName
          : ''
        }
        fieldError={
          (createSystemSpecActionData && createSystemSpecActionData.fieldErrors)
          ? createSystemSpecActionData.fieldErrors.systemName
          : undefined
        }
      />
      <TextArea
        labelText="System Info"
        name="systemInfo"
        defaultValue={
          createSystemSpecActionData?.fields
          ? createSystemSpecActionData.fields.systemInfo
          : ''
        }
        fieldError={
          (createSystemSpecActionData && createSystemSpecActionData.fieldErrors)
          ? createSystemSpecActionData.fieldErrors.systemInfo
          : undefined
        }
      />
      <RoundedButton
        disabled={isSubmittingCreateSystemForm}
        type="submit"
      >
        {isSubmittingCreateSystemForm ? 'Creating' : 'Create'}
      </RoundedButton>
    </Form>
  );
}
