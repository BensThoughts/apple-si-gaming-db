import { Form } from '@remix-run/react';
import FloatingLabelInput from '~/components/FormComponents/SearchInput/FloatingLabelInput';
import TextArea from '~/components/FormComponents/TextArea';
import RoundedButton from '~/components/RoundedButton';
import type { CreateSystemSpecActionData } from '~/routes/profile';

interface CreateSystemFormProps {
  createSystemSpecActionData?: CreateSystemSpecActionData;
}

export default function CreateSystemForm({
  createSystemSpecActionData,
}: CreateSystemFormProps) {
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
