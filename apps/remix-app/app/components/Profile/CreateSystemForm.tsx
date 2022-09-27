import { Form } from '@remix-run/react';
import type { ProfileActionData } from '~/routes/profile';
import FloatingLabelInput from '~/components/FormComponents/SearchInput/FloatingLabelInput';
import TextArea from '~/components/FormComponents/TextArea';
import RoundedButton from '~/components/RoundedButton';

interface CreateSystemFormProps {
  actionData?: ProfileActionData;
}

export default function CreateSystemForm({
  actionData,
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
        fieldError={actionData ? actionData.fieldErrors?.systemName : undefined}
      />
      <TextArea
        labelText="System Info"
        name="systemInfo"
        id="systemInfo"
        fieldError={actionData ? actionData.fieldErrors?.systemInfo : undefined}
      />
      <RoundedButton type="submit">Create</RoundedButton>
    </Form>
  );
}
