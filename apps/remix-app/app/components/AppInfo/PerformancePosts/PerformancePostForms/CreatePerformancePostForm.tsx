import { Form } from '@remix-run/react';
import RoundedButton from '~/components/RoundedButton';
import { useEffect, useRef } from 'react';
import { showToast } from '~/components/Toasts';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type { FrameRate, RatingMedal, GamepadRating, SystemSpecOption } from '~/interfaces';
import PerformancePostFormWrapper from './PerformancePostFormWrapper';
import BasePerformancePostFormFields from './BasePerformancePostFormFields';

interface CreatePerformancePostFormProps {
  steamAppId: number;
  userSession: {
    isLoggedIn: boolean;
    ownsApp: boolean;
    systemSpecOptions: SystemSpecOption[];
  }
  fields?: { // used for defaultValue options
    postText?: string;
    frameRateAverage?: FrameRate | null;
    frameRateStutters?: boolean;
    ratingMedal?: RatingMedal;
    // systemName?: string;
    postTagsIds?: number[];
    gamepadId?: number;
    gamepadRating?: GamepadRating | null;
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
  formError?: string;
  isSubmittingForm: boolean;
  postTagOptions: {
    id: number;
    description: string;
  }[];
  gamepadOptions: {
    id: number;
    description: string;
  }[];
}

export default function CreatePerformancePostForm({
  steamAppId,
  userSession,
  fields,
  formError,
  fieldErrors,
  isSubmittingForm,
  postTagOptions,
  gamepadOptions,
}: CreatePerformancePostFormProps) {
  const {
    isLoggedIn,
    ownsApp,
    systemSpecOptions,
  } = userSession;

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

  if (!isLoggedIn) {
    return (
      <PerformancePostFormWrapper>
        <div>
          You are not logged in. You must&nbsp;
          <RemixUnderlineLink to="/profile">
            login
          </RemixUnderlineLink>
          &nbsp;to post a performance review for this app.
        </div>
      </PerformancePostFormWrapper>
    );
  }

  if (!ownsApp) {
    return (
      <PerformancePostFormWrapper>
        <div className="w-full">
          It looks like you do not own this app yet. Please add it to your steam library to leave a
          performance review.
        </div>
      </PerformancePostFormWrapper>
    );
  }

  const formId = `${steamAppId}-CreatePerformancePost`;
  return (
    <PerformancePostFormWrapper>
      <h2 className="text-secondary text-lg">Submit Your Own Performance Post</h2>
      {formError && <div className="text-color-error">{formError}</div>}
      <Form
        id={formId}
        method="post"
        name="performancePost"
        ref={formRef}
        className="flex flex-col items-center gap-8 w-full max-w-lg"
        action={`/apps/${steamAppId}/performance-posts`}
      >
        <input type="hidden" name="_performancePostAction" value="createPerformancePost" />
        <BasePerformancePostFormFields
          systemSpecOptions={systemSpecOptions}
          gamepadOptions={gamepadOptions}
          postTagOptions={postTagOptions}
          fields={fields}
          fieldErrors={fieldErrors}
        />
        <RoundedButton type="submit" className="max-w-xs">
          {isSubmittingForm ? 'Submitting' : 'Submit'}
        </RoundedButton>
      </Form>
    </PerformancePostFormWrapper>
  );
}
