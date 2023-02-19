import { Form } from '@remix-run/react';
import RoundedButton from '~/components/RoundedButton';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import { useEffect, useRef } from 'react';
import { showToast } from '~/components/Toasts';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type { FrameRate, RatingMedal, GamepadRating } from '~/interfaces';
import PerformancePostFormWrapper from './PerformancePostFormWrapper';
import BasePerformancePostFormFields from './BasePerformancePostFormFields';

interface EditPerformancePostFormProps {
  postId: string;
  steamAppId: number;
  steamUserSession: {
    isLoggedIn: boolean;
    ownsApp: boolean;
    systemNames: string[];
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
    postTagId: number;
    description: string;
  }[];
  gamepadOptions: {
    gamepadId: number;
    description: string;
  }[];
}

export default function EditPerformancePostForm({
  postId,
  steamAppId,
  steamUserSession,
  fields,
  formError,
  fieldErrors,
  isSubmittingForm,
  postTagOptions,
  gamepadOptions,
}: EditPerformancePostFormProps) {
  const {
    isLoggedIn,
    ownsApp,
    systemNames,
  } = steamUserSession;

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

  const systemNameOptions: SelectOption[] = systemNames.map((sysName) => (
    {
      name: sysName,
      value: sysName,
    }
  ));
  systemNameOptions.unshift({
    name: 'None',
    value: 'None',
  });

  const formId = `${steamAppId}-EditPerformancePost`;
  return (
    <PerformancePostFormWrapper>
      <h2 className="text-secondary text-lg">Edit Performance Post</h2>
      {formError && <div className="text-color-error">{formError}</div>}
      <Form
        id={formId}
        method="post"
        name="performancePost"
        ref={formRef}
        className="flex flex-col items-center gap-8 w-full max-w-lg"
        action={`/apps/${steamAppId}/performance-posts/edit/${postId}`}
      >
        <input type="hidden" name="_performancePostAction" value="createPerformancePost" />
        <BasePerformancePostFormFields
          systemNames={systemNames}
          gamepadOptions={gamepadOptions}
          postTagOptions={postTagOptions}
          fields={fields}
          fieldErrors={fieldErrors}
        />
        <RoundedButton type="submit" className="max-w-xs">
          {isSubmittingForm ? 'Submitting' : 'Edit'}
        </RoundedButton>
      </Form>
    </PerformancePostFormWrapper>
  );
}