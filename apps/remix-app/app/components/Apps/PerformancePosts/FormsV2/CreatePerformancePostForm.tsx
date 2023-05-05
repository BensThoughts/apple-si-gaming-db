import { Form } from '@remix-run/react';
import RoundedButton from '~/components/Buttons/RoundedButton';
import { useEffect } from 'react';
import { showToast } from '~/components/Toasts';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type {
  SystemSpecOption,
} from '~/types';
import PerformancePostFormWrapper from './PerformancePostFormWrapper';
import BasePerformancePostFormFields from './BasePerformancePostFormFields';
import { useUserSession } from '~/lib/hooks/useMatchesData';
import { PerformancePostFormStateProvider } from './FormContext/PerformancePostFormContext';
import type { CreateOrEditPerformancePostActionData } from '~/lib/form-actions/performance-post/types';

interface CreatePerformancePostFormProps {
  steamAppId: number;
  formError?: CreateOrEditPerformancePostActionData['formError'];
  fieldErrors?: CreateOrEditPerformancePostActionData['fieldErrors'];
  fields?: CreateOrEditPerformancePostActionData['fields']; // used for defaultValue options
  isSubmittingForm: boolean;
  postTagOptions: {
    id: number;
    description: string;
  }[];
  gamepadOptions: {
    id: number;
    description: string;
  }[];
  steamUserProfileOwnsApp: boolean;
}

export default function CreatePerformancePostForm({
  steamAppId,
  fields,
  formError,
  fieldErrors,
  isSubmittingForm,
  postTagOptions,
  gamepadOptions,
  steamUserProfileOwnsApp,
}: CreatePerformancePostFormProps) {
  const { userSession } = useUserSession();

  useEffect(() => {
    if (formError) {
      showToast.error(formError);
    }
  }, [formError]);

  if (!userSession) {
    return (
      <PerformancePostFormWrapper>
        <div>
          You are not logged in with Steam. You must&nbsp;
          <RemixUnderlineLink to="/profile">
            login
          </RemixUnderlineLink>
          &nbsp;to post a performance review for this app.
        </div>
      </PerformancePostFormWrapper>
    );
  }

  const { userProfile } = userSession;

  if (!steamUserProfileOwnsApp) {
    return (
      <PerformancePostFormWrapper>
        <div className="w-full">
          It looks like you do not own this app yet. Please add it to your steam library to leave a
          performance review. (You may need to re-sync library as well)
        </div>
      </PerformancePostFormWrapper>
    );
  }

  const systemSpecOptions: SystemSpecOption[] = userProfile.systemSpecs
      .map(({ systemSpecId, systemName }) => ({ id: systemSpecId, systemName }));

  const formId = `${steamAppId}-CreatePerformancePost`;
  return (
    <PerformancePostFormStateProvider>
      <PerformancePostFormWrapper>
        <Form
          id={formId}
          method="post"
          name="performancePost"
          className="flex flex-col items-center gap-6 w-full max-w-lg"
          action={`/apps/${steamAppId}/posts`}
        >
          <input type="hidden" name="_performancePostAction" value="createPerformancePost" />
          <BasePerformancePostFormFields
            formId={formId}
            fields={fields}
            formError={formError}
            fieldErrors={fieldErrors}
            systemSpecOptions={systemSpecOptions}
            gamepadOptions={gamepadOptions}
            postTagOptions={postTagOptions}
            editorPlaceholderText="Create Post..."
            isSubmittingForm={isSubmittingForm}
          />
          <RoundedButton type="submit" disabled={isSubmittingForm} className="focus-visible:show-ring-tertiary">
            {isSubmittingForm ? 'Creating' : 'Create'}
          </RoundedButton>
        </Form>
      </PerformancePostFormWrapper>
    </PerformancePostFormStateProvider>
  );
}
