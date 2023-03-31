import { Form, useNavigation } from '@remix-run/react';
import MaterialInputOutlinedV2 from '~/components/FormComponents/MaterialInputOutlinedV2';
// import MaterialInputOutlined from '~/components/FormComponents/MaterialInputOutlined';
// import TextArea from '~/components/FormComponents/TextArea';
import MaterialTextAreaOutlined from '~/components/FormComponents/MaterialTextAreaOutlined';
import RoundedButton from '~/components/Buttons/RoundedButton';
import type { CreateSystemSpecActionData } from '~/lib/form-actions/profile/interfaces';
import { showToast } from '~/components/Toasts';
import { useEffect, useState } from 'react';
import { validateNewSystemName, validateSystemInfo } from '~/lib/form-validators/profile';
import TailwindDisclosure from '~/components/HeadlessComponents/TailwindDisclosure';
import CreateSystemInstructions from './CreateSystemInstructions';

interface CreateSystemFormProps {
  createSystemSpecActionData?: CreateSystemSpecActionData;
  currentSystemNames: string[];
}

export default function CreateSystemForm({
  createSystemSpecActionData,
  currentSystemNames,
}: CreateSystemFormProps) {
  const navigation = useNavigation();
  const [systemNameValue, setSystemNameValue] = useState('');
  const [touchedNameField, setTouchedNameField] = useState(false);
  const [systemInfoValue, setSystemInfoValue] = useState('');
  const [touchedSystemInfoField, setTouchedSystemInfoField] = useState(false);
  const systemNameErrorMessage = validateNewSystemName(systemNameValue, currentSystemNames);
  const systemInfoErrorMessage = validateSystemInfo(systemInfoValue);
  const displayNameError = touchedNameField && Boolean(systemNameErrorMessage);
  const displaySystemInfoError = touchedSystemInfoField && Boolean(systemInfoErrorMessage);

  const isSubmittingCreateSystemForm =
    navigation.state === 'submitting' &&
    navigation.formData.get('_profileAction') === 'createSystem';

  useEffect(() => {
    if (createSystemSpecActionData) {
      const {
        fieldErrors,
        fields,
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
      if (fields) {
        setSystemNameValue(fields.systemName);
        setSystemInfoValue(fields.systemInfo);
      }
    }
  }, [createSystemSpecActionData]);

  // const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isSubmittingCreateSystemForm) {
      // formRef.current?.reset();
      setSystemNameValue('');
      setSystemInfoValue('');
      setTouchedNameField(false);
      setTouchedSystemInfoField(false);
    }
  }, [isSubmittingCreateSystemForm]);

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full  max-w-lg bg-tertiary rounded-lg p-6">
      <h3 className="text-secondary text-lg">Create a New System</h3>
      <TailwindDisclosure title="How to Create a System" defaultOpen={false}>
        <div className="p-3 bg-primary rounded-b-lg">
          <CreateSystemInstructions />

        </div>
      </TailwindDisclosure>
      <Form
        action="/profile/systems"
        method="post"
        // ref={formRef}
        className="flex flex-col gap-3 items-center w-full"
        reloadDocument={false}
      >
        <input type="hidden" name="_profileAction" value="createSystem" />
        <MaterialInputOutlinedV2
          label="System Name"
          name="systemName"
          value={systemNameValue}
          onChange={(e) => setSystemNameValue(e.currentTarget.value)}
          onBlur={() => setTouchedNameField(true)}
          errorMessage={displayNameError ? systemNameErrorMessage : undefined}
          type="text"
          required
          minLength={3}
          maxLength={25}
        />
        <MaterialTextAreaOutlined
          label="System Information"
          name="systemInfo"
          value={systemInfoValue}
          onChange={(e) => setSystemInfoValue(e.currentTarget.value)}
          onBlur={() => setTouchedSystemInfoField(true)}
          errorMessage={displaySystemInfoError ? systemInfoErrorMessage : undefined}
        // defaultValue={
        //   createSystemSpecActionData?.fields
        //   ? createSystemSpecActionData.fields.systemInfo
        //   : ''
        // }
        // errorMessage={
        //   (createSystemSpecActionData && createSystemSpecActionData.fieldErrors)
        //   ? createSystemSpecActionData.fieldErrors.systemInfo
        //   : undefined
        // }
        />
        <RoundedButton
          disabled={isSubmittingCreateSystemForm}
          type="submit"
        >
          {isSubmittingCreateSystemForm ? 'Creating' : 'Create'}
        </RoundedButton>
      </Form>
    </div>
  );
}
