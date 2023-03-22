import { Form } from '@remix-run/react';
import RoundedButton from '~/components/RoundedButton';
import { useEffect, useRef } from 'react';
import { showToast } from '~/components/Toasts';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type { FrameRate, RatingMedal, GamepadRating, PostTagOption, GamepadOption, SystemSpecOption } from '~/interfaces';
import PerformancePostFormWrapper from './PerformancePostFormWrapper';
import BasePerformancePostFormFields from './BasePerformancePostFormFields';
import RoundedButtonRemixLink from '~/components/RoundedButtonRemixLink';
import { useUserSession } from '~/lib/hooks/useMatchesData';

interface EditPerformancePostFormProps {
  performancePostId: number;
  steamAppId: number;
  formError?: string;
  fields?: { // used for defaultValue options
    postText?: string;
    frameRateAverage?: FrameRate | null;
    frameRateStutters?: boolean;
    ratingMedal?: RatingMedal;
    postTagsIds?: number[];
    gamepadId?: number;
    gamepadRating?: GamepadRating | null;
    systemSpecId?: number;
  };
  fieldErrors?: {
    postText?: string;
    frameRateAverage?: string;
    ratingMedal?: string;
    systemName?: string;
    postTags?: string;
    gamepadId?: string;
    gamepadRating?: string;
  };
  isSubmittingForm: boolean;
  postTagOptions: PostTagOption[];
  gamepadOptions: GamepadOption[];
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
}: EditPerformancePostFormProps) {
  const { userSession } = useUserSession();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isSubmittingForm) {
      formRef.current?.reset();
    }
  }, [isSubmittingForm]);

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

  const systemSpecOptions: SystemSpecOption[] = userProfile.systemSpecs
      .map(({ systemSpecId, systemName }) => ({ id: systemSpecId, systemName }));

  const formId = `${steamAppId}-EditPerformancePost`;
  return (
    <PerformancePostFormWrapper>
      <h2 className="text-secondary text-lg">Edit Post</h2>
      {formError && <div className="text-error">{formError}</div>}
      <Form
        id={formId}
        method="post"
        name="performancePost"
        ref={formRef}
        className="flex flex-col items-center gap-8 w-full max-w-lg"
        action={`/apps/${steamAppId}/posts/edit/${performancePostId}`}
      >
        <input type="hidden" name="_performancePostAction" value="editPerformancePost" />
        <input type="hidden" name="performancePostId" value={performancePostId} />
        <BasePerformancePostFormFields
          systemSpecOptions={systemSpecOptions}
          gamepadOptions={gamepadOptions}
          postTagOptions={postTagOptions}
          fields={fields}
          fieldErrors={fieldErrors}
        />
        <div className="w-full flex gap-x-3 justify-around">
          <RoundedButtonRemixLink to={`/apps/${steamAppId}/posts/`}>
            Cancel
          </RoundedButtonRemixLink>
          <RoundedButton type="submit" className="max-w-xs" disabled={isSubmittingForm}>
            {isSubmittingForm ? 'Editing' : 'Edit'}
          </RoundedButton>
        </div>

      </Form>
    </PerformancePostFormWrapper>
  );
}
