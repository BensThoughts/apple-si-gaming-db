import { Form } from '@remix-run/react';
import RoundedButton from '~/components/Buttons/RoundedButton';
import { useEffect } from 'react';
import { showToast } from '~/components/Toasts';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import PerformancePostFormWrapper from './PerformancePostFormWrapper';
import BasePerformancePostFormFields from './BasePerformancePostFormFields';
import RoundedButtonRemixLink from '~/components/Buttons/RoundedButtonRemixLink';
import { useUserSession } from '~/lib/hooks/useMatchesData';
import { EditPostURLParams } from '~/lib/enums/URLSearchParams/EditPost';
import { PerformancePostFormStateProvider } from './FormContext/PerformancePostFormContext';
import type { CreateOrEditPerformancePostActionData } from '~/lib/form-actions/performance-post/types';
import type { PostTagMultiSelectOption } from './FormComponents/PostTagMultiSelectMenu';
import type { GamepadSelectOption } from './FormComponents/GamepadRating/GamepadSelectMenu';
import type { SystemSpecSelectOption } from './FormComponents/SystemSelectMenuCard/SystemSelectMenu';

interface EditPerformancePostFormProps {
  performancePostId: number;
  steamAppId: number;
  formError?: CreateOrEditPerformancePostActionData['formError'];
  fields?: CreateOrEditPerformancePostActionData['fields'] // used for defaultValue options
  fieldErrors?: CreateOrEditPerformancePostActionData['fieldErrors'];
  isSubmittingForm: boolean;
  postTagOptions: PostTagMultiSelectOption[];
  gamepadOptions: GamepadSelectOption[];
  redirectToAfterEdit: string | null;
}

export default function EditPerformancePostForm({
  performancePostId,
  steamAppId,
  fields,
  formError,
  fieldErrors,
  isSubmittingForm,
  postTagOptions,
  gamepadOptions,
  redirectToAfterEdit,
}: EditPerformancePostFormProps) {
  const { userSession } = useUserSession();

  useEffect(() => {
    if (formError) {
      showToast.error(formError);
    }
  }, [formError]);

  // This should never trigger, the server redirects
  // on the route that shows this form if this is the case
  if (!userSession) {
    return (
      <PerformancePostFormWrapper>
        <div>
          You are not logged in. You must&nbsp;
          <RemixUnderlineLink to="/profile">
            login
          </RemixUnderlineLink>
          &nbsp;to edit a performance review.
        </div>
      </PerformancePostFormWrapper>
    );
  }

  const { userProfile } = userSession;

  const systemSpecOptions: SystemSpecSelectOption[] = userProfile.systemSpecs
      .map(({ systemSpecId, systemName }) => ({ name: systemName, value: systemSpecId }));

  const formId = `${steamAppId}-EditPerformancePost`;
  let action = `/apps/${steamAppId}/posts/edit/${performancePostId}`;
  if (redirectToAfterEdit) {
    const params = new URLSearchParams([
      [EditPostURLParams.REDIRECT_TO_AFTER_EDIT, redirectToAfterEdit],
    ]);
    action = action.concat(`?${params.toString()}`);
  }
  return (
    <PerformancePostFormStateProvider>
      <PerformancePostFormWrapper>
        <Form
          id={formId}
          method="post"
          name="performancePost"
          className="flex flex-col items-center gap-8 w-full max-w-lg"
          action={action}
        >
          <input type="hidden" name="_performancePostAction" value="editPerformancePost" />
          <input type="hidden" name="performancePostId" value={performancePostId} />
          <BasePerformancePostFormFields
            formId={formId}
            fields={fields}
            formError={formError}
            fieldErrors={fieldErrors}
            systemSpecOptions={systemSpecOptions}
            gamepadOptions={gamepadOptions}
            postTagOptions={postTagOptions}
            editorPlaceholderText="Edit Post..."
            isSubmittingForm={isSubmittingForm}
          />
          <div className="w-full flex gap-x-3 justify-around">
            <RoundedButtonRemixLink
              to={redirectToAfterEdit ? redirectToAfterEdit : `/apps/${steamAppId}/posts/`}
              className="focus-visible:show-ring-tertiary"
            >
              Cancel
            </RoundedButtonRemixLink>
            <RoundedButton
              type="submit"
              className="max-w-xs focus-visible:show-ring-tertiary"
              disabled={isSubmittingForm}>
              {isSubmittingForm ? 'Editing' : 'Edit'}
            </RoundedButton>
          </div>
        </Form>
      </PerformancePostFormWrapper>
    </PerformancePostFormStateProvider>
  );
}
