import { Form } from '@remix-run/react';
import FloatingLabelInput from '~/components/FormComponents/SearchInput/FloatingLabelInput';
import TextArea from '~/components/FormComponents/TextArea';
import RoundedButton from '~/components/RoundedButton';
import type { CreateSystemSpecActionData } from '~/routes/profile';
import { errorToast } from '~/components/Toasts';
import { useEffect } from 'react';

interface CreateSystemFormProps {
  createSystemSpecActionData?: CreateSystemSpecActionData;
}

export default function CreateSystemForm({
  createSystemSpecActionData,
}: CreateSystemFormProps) {
  useEffect(() => {
    if (createSystemSpecActionData) {
      const {
        fieldErrors,
        formError,
      } = createSystemSpecActionData;
      if (formError) {
        errorToast(formError);
      }
      if (fieldErrors && fieldErrors.systemName) {
        errorToast(fieldErrors.systemName);
      }
      if (fieldErrors && fieldErrors.systemInfo) {
        errorToast(fieldErrors.systemInfo);
      }
    }
  }, [createSystemSpecActionData]);

  return (
    <Form
      action="/profile"
      method="post"
      className="w-full max-w-lg flex flex-col items-center gap-3"
    >
      <input type="hidden" name="action" value="createSystem" />
      <FloatingLabelInput
        name="systemName"
        label="System Name..."
        fieldError={
          (createSystemSpecActionData && createSystemSpecActionData.fieldErrors)
          ? createSystemSpecActionData.fieldErrors.systemName
          : undefined
        }
      />
      <TextArea
        labelText="System Info"
        name="systemInfo"
        id="systemInfo"
        fieldError={
          (createSystemSpecActionData && createSystemSpecActionData.fieldErrors)
          ? createSystemSpecActionData.fieldErrors.systemInfo
          : undefined
        }
      />
      <RoundedButton type="submit">Create</RoundedButton>
    </Form>
  );
}
